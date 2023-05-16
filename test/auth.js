const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before } = require('mocha');
const app = require('../server-test');
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const should = chai.should();

const User = require('../models/user');

before(async () => {
  // make a test account
  await User.deleteMany({});
  const user = await chai
    .request(app)
    .post('/users/signup')
    .send({
      username: 'testuser',
      email: 'test@email.com',
      password: 'password'
    });
  user.should.have.status(201);
});

describe('Authentication/Authorization tests', () => {
  // account creation
  it('should allow a user to sign up with the required parameters', async () => {
    const user = await chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'newuser',
        email: 'newuser@email.com',
        password: 'password'
      });
    user.should.have.status(201);
  });

  it('should reject a user creation if the username is not unique', async () => {
    const user = await chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'testuser',
        email: 'newtestuser@email.com',
        password: 'password'
      });
    user.should.have.status(400);
  })

  it('should reject a user creation if the email is not unique', async () => {
    const user = await chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'newuser',
        email: 'testuser@email.com',
        password: 'password'
      });
    user.should.have.status(400);
  })

  it('should reject a user creation if the username is blank', async () => {
    const user = await chai
      .request(app)
      .post('/users/signup')
      .send({
        username: '',
        email: 'testuser@email.com',
        password: 'password'
      });
    user.should.have.status(400);
  })

  it('should reject a user creation if the email is blank', async () => {
    const user = await chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'newuser',
        email: '',
        password: 'password'
      });
    user.should.have.status(400);
  })

  it('should reject a user creation if the password is blank', async () => {
    const user = await chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'newuser',
        email: 'newuser@email.com',
        password: ''
      });
    user.should.have.status(400);
  })

  // login
  it('should be able to login with correct username and password', async () =>{
    const loginRes = await chai
      .request(app)
      .post('/users/login')
      .send({ username: 'testuser', password: 'password' })
    loginRes.should.have.status(200);
    loginRes.should.have.cookie('nToken');
    loginRes.body.should.have.property('token');
  });

  it('should not be able to login if username and password combination is incorrect', async () =>{
    const badUsername = await chai
      .request(app)
      .post('/users/login')
      .send({ username: 'fake', password: 'password' })
    badUsername.should.have.status(401);

    const badPassword = await chai
      .request(app)
      .post('/users/login')
      .send({ username: 'testuser', password: 'fake' })
      badPassword.should.have.status(401);

    const badBoth = await chai
      .request(app)
      .post('/users/login')
      .send({ username: 'fake', password: 'fake' })
      badBoth.should.have.status(401);
  });

  // logout
  it('should be able to logout a logged in user', async () => {
    const loginRes = await chai
      .request(app)
      .post('/users/login')
      .send({ username: 'testuser', password: 'password' })
    loginRes.should.have.status(200);
    loginRes.should.have.cookie('nToken');
    loginRes.body.should.have.property('token');
    token = loginRes.body.token

    const logout = await chai
      .request(app)
      .get('/users/logout')
      .set('Authorization', `Bearer ${token}`);
    logout.should.have.status(200)
    logout.should.not.have.cookie('nToken')
  });

  it('should should fail to log out if the user is not logged in or has no bearer token', async () => {
    const loginRes = await chai
      .request(app)
      .post('/users/login')
      .send({ username: 'testuser', password: 'password' })
    loginRes.should.have.status(200);
    loginRes.should.have.cookie('nToken');
    loginRes.body.should.have.property('token');
    token = loginRes.body.token;

    const logout = await chai
      .request(app)
      .get('/users/logout')
      .set('Authorization', `Bearer ${token}`);
    logout.should.have.status(200);
    logout.should.not.have.cookie('nToken');

    const logoutAgain = await chai
      .request(app)
      .get('/users/logout');
    logoutAgain.should.have.status(401);
  });
});