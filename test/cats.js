const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, beforeEach, afterEach, before } = require('mocha');
const app = require('../server-test');
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const should = chai.should();
const extApis = require('../controllers/helpers');

const User = require('../models/user');
const Cat = require('../models/cat');
const Shelter = require('../models/shelter');

before(async () => {
  // make a test user and login
  await User.deleteMany({});
  await Cat.deleteMany({});
  await Shelter.deleteMany({});
  const user = await chai
    .request(app)
    .post('/users/signup')
    .send({
      username: 'testuser',
      email: 'test@email.com',
      password: 'password'
    });
  user.should.have.status(201);

  const loginRes = await chai
    .request(app)
    .post('/users/login')
    .send({ username: 'testuser', password: 'password' });
  loginRes.should.have.status(200);
  loginRes.body.should.have.property('token');
  token = loginRes.body.token;

  // make a test shelter and cat using the logged in user's JWT
  const shelter = await chai
    .request(app)
    .post('/shelters')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Pride Rescue',
      country: 'Canada',
      state: 'ON',
      phone: '123-234-3456',
      email: 'priderescue@email.com',
    });
  shelter.should.have.status(201);  
});

describe('Cat tests', () => {
  // before / after each test

  beforeEach(async () => {
    const cat = await chai
    .request(app)
    .post('/cats')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test',
      breed: 'Trash Goblin',
      age: 3,
      description: "Fished from the gutter with a shrimp on a string",
    });
    cat.should.have.status(201);
  });

  afterEach(async () => {
    await Cat.deleteMany({name: ["Butter", "Changed", "Test"]})
    shelters = await Shelter.find();
    foundShelter = shelters[0];
    foundShelter.cats = [];
    await foundShelter.save();
  });

  // check external APIs
  it('should receive a response from the CatFact API for a fact', async () => {
    try {
      fact = await extApis.getCatFact();
    } catch(err) {
      console.log(err);
    };
    fact.should.be.a("string");
  });

  it('should receive a response from the catapi API for an image', async () => {
    try {
      image = await extApis.getCatImage();
    } catch(err) {
      console.log(err);
    };
    image.should.be.a("string");
  });

  // test getting list of all cats
  it('should allow a signed in user to find a list of cats', async () => {
    const cats = await chai
      .request(app)
      .get('/cats')
      .set('Authorization', `Bearer ${token}`);
    cats.should.have.status(200);
    getCats = await Cat.find();
    getCats.should.have.length(1);
    getCats[0].name.should.equal("Test")
  })

  it('should not allow an anonymous user to find a list of cats', async () => {
    const cats = await chai
      .request(app)
      .get('/cats');
    cats.should.have.status(401);
  })

  // test showing a specific cat

  it('should allow a signed in user to find a specific cat', async() => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    const cat = await chai
      .request(app)
      .get(`/cats/${idString}`)
      .set('Authorization', `Bearer ${token}`);
    cat.should.have.status(200);
    cat.body.name.should.equal("Test");
  })

  it('should not allow an anonymous user to find a specific cat', async() => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    const cat = await chai
      .request(app)
      .get(`/cats/${idString}`);
    cat.should.have.status(401);
  })

  it('should allow a signed in user to update attributes of a cat', async() => {
    let cats = await Cat.find();
    let testCat = cats[0];
    const idString = testCat._id;
    testCat.name.should.equal("Test");
    testCat.breed.should.equal("Trash Goblin");
    testCat.age.should.equal(3);
    testCat.description.should.equal("Fished from the gutter with a shrimp on a string");
    const cat = await chai
      .request(app)
      .patch(`/cats/${idString}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Changed",
        breed: "Changed",
        age: 999,
        description: "Changed"
      });
    cat.should.have.status(200);
    cats = await Cat.find();
    testCat = cats[0];
    testCat.name.should.equal("Changed");
    testCat.breed.should.equal("Changed");
    testCat.age.should.equal(999);
    testCat.description.should.equal("Changed");
  })

  it('should only update the name, breed, age and description of a cat', async() => {
    let cats = await Cat.find();
    let testCat = cats[0];
    const idString = testCat._id;
    testCat.name.should.equal("Test");
    testCat.breed.should.equal("Trash Goblin");
    testCat.age.should.equal(3);
    testCat.description.should.equal("Fished from the gutter with a shrimp on a string");
    const cat = await chai
      .request(app)
      .patch(`/cats/${idString}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Changed",
        breed: "Changed",
        age: 999,
        description: "Changed",
        pictureUrl: "Changed",
        fact: "Changed",
        loveMeter: 9001,
        favouriteThing: "Violence"
      });
    cat.should.have.status(401);
  });

  it('should not allow an anonymous in user to update attributes of a cat', async() => {
    let cats = await Cat.find();
    let testCat = cats[0];
    const idString = testCat._id;
    testCat.name.should.equal("Test");
    testCat.breed.should.equal("Trash Goblin");
    testCat.age.should.equal(3);
    testCat.description.should.equal("Fished from the gutter with a shrimp on a string");
    const cat = await chai
      .request(app)
      .patch(`/cats/${idString}`)
      .send({
        name: "Changed",
        breed: "Changed",
        age: 999,
        description: "Changed"
      });
    cat.should.have.status(401);
  });

  // test creating a new cat

  it('should allow a signed-in user to create a cat', async () => {
    const shelters = await Shelter.find();
    const testShelter = shelters[0];
    const cat = await chai
      .request(app)
      .post('/cats')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Butter',
        breed: 'Domestic Medium Hair',
        age: 9,
        description: "Biggest, bravest boy",
        shelter: testShelter._id
      });
    cat.should.have.status(201);
    const updatedShelter = await Shelter.findById(testShelter._id);
    updatedShelter.cats.should.have.length(2);
  });

  it('should not allow an anonymous user to create a cat', async () => {
    const testShelter = await Shelter.find();
    const cat = await chai
    .request(app)
    .post('/cats')
    .send({
      name: 'Butter',
      breed: 'Domestic Medium Hair',
      age: 9,
      description: "Biggest, bravest boy",
      shelter: testShelter._id
    });
    cat.should.have.status(401);
  });

  it('should randomly assign a shelter if one is not selected', async () => {
    const cat = await chai
      .request(app)
      .post('/cats')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Butter',
        breed: 'Domestic Medium Hair',
        age: 9,
        description: "Biggest, bravest boy",
      });
    cat.should.have.status(201);
    const cats = await Cat.find();
    const savedCat = cats[0];
    const shelters = await Shelter.find();
    const foundShelter = shelters[0];
    savedCat.should.have.property("shelter");
    savedCat.shelter.should.deep.equal(foundShelter._id);
    foundShelter.cats.should.have.length(2);
  })

  // test deleting a cat

  it('should allow a logged in user to delete a cat', async () => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    const cat = await chai
      .request(app)
      .delete(`/cats/${idString}`)
      .set('Authorization', `Bearer ${token}`);
    cat.should.have.status(200);
  });

  it('should not allow an anonymous user to delete a cat', async () => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    const cat = await chai
      .request(app)
      .delete(`/cats/${idString}`)
    cat.should.have.status(401);
  });

  it('should allow a logged in user to pet a cat', async () => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    let cat = await chai
      .request(app)
      .put(`/cats/${idString}/pet`)
      .set('Authorization', `Bearer ${token}`);
    cat.should.have.status(200);
    cat = await Cat.findById(idString);
    if (cat.favouriteThing === "pets") {
      cat.loveMeter.should.equal(3);
    } else {
      cat.loveMeter.should.equal(1);
    };
  });

  it('should now allow an anonymous user to delete a cat', async () => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    const cat = await chai
      .request(app)
      .put(`/cats/${idString}/pet`);
    cat.should.have.status(401);
  });

  it('should allow a logged in user to play with a cat', async () => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    let cat = await chai
      .request(app)
      .put(`/cats/${idString}/play`)
      .set('Authorization', `Bearer ${token}`);
    cat.should.have.status(200);
    cat = await Cat.findById(idString);
    if (cat.favouriteThing === "play") {
      cat.loveMeter.should.equal(3);
    } else {
      cat.loveMeter.should.equal(1);
    };
  });

  it('should now allow an anonymous user to play with a cat', async () => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    const cat = await chai
      .request(app)
      .put(`/cats/${idString}/play`);
    cat.should.have.status(401);
  });

  it('should allow a logged in user to give treats to a cat', async () => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    let cat = await chai
      .request(app)
      .put(`/cats/${idString}/treats`)
      .set('Authorization', `Bearer ${token}`);
    cat.should.have.status(200);
    cat = await Cat.findById(idString);
    if (cat.favouriteThing === "treats") {
      cat.loveMeter.should.equal(3);
    } else {
      cat.loveMeter.should.equal(1);
    };
  });

  it('should now allow an anonymous user to give treats a cat', async () => {
    const cats = await Cat.find();
    const testCat = cats[0];
    const idString = testCat._id;
    const cat = await chai
      .request(app)
      .put(`/cats/${idString}/treats`);
    cat.should.have.status(401);
  });

  after(() => {
    app.close();
    mongoose.connection.close();
  });
});