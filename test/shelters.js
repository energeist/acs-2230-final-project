// For whatever reason my cats test file and shelter test file run fine independently but keep breaking if I try to run both at the same time, even when running in serial
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, beforeEach, afterEach, before } = require('mocha');
const app = require('../server-test');
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const should = chai.should();

const User = require('../models/user');
const Cat = require('../models/cat');
const Shelter = require('../models/shelter');

before(async () => {
  // make a test user and login
  await User.deleteMany({});
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
});

describe('Shelter tests', () => {
  // before / after each test

  beforeEach(async () => {
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
  })

  afterEach(async () => {
    await Shelter.deleteMany({});
  })

  // test getting list of all shelters
  it('should allow a signed in user to find a list of shelters', async () => {
    const shelters = await chai
      .request(app)
      .get('/shelters')
      .set('Authorization', `Bearer ${token}`);
    shelters.should.have.status(200);
    getShelters = await Shelter.find();
    getShelters.should.have.length(1);
    getShelters[0].name.should.equal("Pride Rescue");
  });

  it('should not allow an anonymous user to find a list of shelters', async () => {
    const shelters = await chai
      .request(app)
      .get('/shelters');
    shelters.should.have.status(401);
  });

  // test showing a specific shelter

  it('should allow a signed in user to find a specific shelter', async() => {
    const shelters = await Shelter.find();
    const testShelter = shelters[0];
    const idString = testShelter._id;
    const shelter = await chai
      .request(app)
      .get(`/shelters/${idString}`)
      .set('Authorization', `Bearer ${token}`);
    shelter.should.have.status(200);
    shelter.body.name.should.equal("Pride Rescue");
  });

  it('should not allow an anonymous user to find a specific shelter', async() => {
    const shelters = await Shelter.find();
    const testShelter = shelters[0];
    const idString = testShelter._id;
    const shelter = await chai
      .request(app)
      .get(`/shelters/${idString}`);
    shelter.should.have.status(401);
  });

  it('should allow a signed in user to update attributes of a shelter', async() => {
    let shelters = await Shelter.find();
    let testShelter = shelters[0];
    const idString = testShelter._id;
    console.log(`idString: ${idString}`)
    testShelter.name.should.equal("Pride Rescue");
    testShelter.country.should.equal("Canada");
    testShelter.state.should.equal("ON");
    testShelter.phone.should.equal("123-234-3456");
    testShelter.email.should.equal("priderescue@email.com");
    const shelter = await chai
      .request(app)
      .put(`/shelters/${idString}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Changed",
        country: "Changed",
        state: "Changed",
        phone: "Changed",
        email: "Changed"
      });
    shelter.should.have.status(200);
    shelters = await Shelter.find();
    testShelter = shelters[0];
    testShelter.name.should.equal("Changed");
    testShelter.country.should.equal("Changed");
    testShelter.state.should.equal("Changed");
    testShelter.phone.should.equal("Changed");
    testShelter.email.should.equal("Changed");
  });

  it('should not allow an anonymous in user to update attributes of a shelter', async() => {
    let shelters = await Shelter.find();
    let testShelter = shelters[0];
    const idString = testShelter._id;
    testShelter.name.should.equal("Pride Rescue");
    testShelter.country.should.equal("Canada");
    testShelter.state.should.equal("ON");
    testShelter.phone.should.equal("123-234-3456");
    testShelter.email.should.equal("priderescue@email.com");
    const shelter = await chai
      .request(app)
      .put(`/shelters/${idString}`)
      .send({
        name: "Changed",
        country: "Changed",
        state: "Changed",
        phone: "Changed",
        email: "Changed"
      });
    shelter.should.have.status(401);
  });

  // test creating a new shelter

  it('should allow a signed-in user to create a shelter', async () => {
    await Shelter.deleteMany({});
    const shelter = await chai
      .request(app)
      .post('/shelters')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Test",
        country: "Test",
        state: "Test",
        phone: "987-876-7654",
        email: "test@email.com"
      });
    shelter.should.have.status(201);
    const shelters = await Shelter.find();
    const testShelter = shelters[0];
    testShelter.name.should.equal("Test");
    testShelter.country.should.equal("Test");
    testShelter.state.should.equal("Test");
    testShelter.phone.should.equal("987-876-7654");
    testShelter.email.should.equal("test@email.com");
  });

  it('should not allow an anonymous user to create a shelter', async () => {
    const testShelter = await Shelter.find();
    const shelter = await chai
    .request(app)
    .post('/shelters')
    .send({
      name: "Test",
      country: "Test",
      state: "Test",
      phone: "987-876-7654",
      email: "test@email.com"
    });
    shelter.should.have.status(401);
  });

  // test deleting a shelter

  it('should allow a logged in user to delete a shelter', async () => {
    const shelters = await Shelter.find();
    const testShelter = shelters[0];
    const idString = testShelter._id;
    const shelter = await chai
      .request(app)
      .delete(`/shelters/${idString}`)
      .set('Authorization', `Bearer ${token}`);
    console.log(shelter.error.message)
    shelter.should.have.status(200);
  });

  it('should not allow an anonymous user to delete a shelter', async () => {
    const shelters = await Shelter.find();
    const testShelter = shelters[0];
    const idString = testShelter._id;
    const shelter = await chai
      .request(app)
      .delete(`/shelters/${idString}`)
    shelter.should.have.status(401);
  });

  after(() => {
    app.close();
    mongoose.connection.close();
  });
});