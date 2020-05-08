const bcrypt = require('bcryptjs');
const { User } = require('../../../users/models');
const sinon = require('sinon')
const sinonChai = require('sinon-chai');
const mongoose = require('mongoose')

const chai = require('chai');
const { expect } = chai;
chai.use(sinonChai);

describe('.hashPassword', function() {
  const password = 'password';
  let bcryptHashStub;
  const error = new Error();

    // Since sinon@5.0.0, the sinon object is a default sandbox.
  // Unless you have a very advanced setup or need a special configuration,
  // you probably want to only use that one.

  beforeEach(function() {
    // sinon.sandbox.create();
    bcryptHashStub = sinon.stub(bcrypt, 'hash');
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should call bycrypt to hash the password', function() {
    bcryptHashStub.resolves('def79');

    return User.hashPassword(password).then(function(hash) {
      expect(bcryptHashStub).to.have.callCount(1)
      expect(hash).to.eq('def79')
    });
  });

  xit('should return an error if passed null', function() {
  });

  xit('should return an error if passed undefined', function() {
  });

  xit('should return an error if passed empty sring', function() {
  });

  xit('should raise if hashing fails', function() {

  });
});

describe('.validatePassword', function() {
  let bcryptCompareStub;
  const error = new Error();

    // Since sinon@5.0.0, the sinon object is a default sandbox.
  // Unless you have a very advanced setup or need a special configuration,
  // you probably want to only use that one.

  beforeEach(function() {
    bcryptCompareStub = sinon.stub(bcrypt, 'compare');
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should call bycrpt compare to validate the password', function() {
    const testUser = new User({email: 'test@email.com', password: 'foo'})
      testUser.validatePassword('foo')
      expect(bcryptCompareStub).to.have.callCount(1)
  });

  describe('.serialize', function() {
    it('should return serialized user data', function(){
      const testUser = new User({email: 'test@email.com', password: 'foo'})
      const serializedUser = testUser.serialize()
      expect(serializedUser).not.to.have.property('_id')
      expect(serializedUser).not.to.have.property('password')
      expect(serializedUser).to.have.property('email')
      expect(serializedUser).to.have.property('id')
      expect(serializedUser).to.be.an('object')
      expect(serializedUser.email).to.equal('test@email.com')
      expect(serializedUser.id).to.be.an.instanceof(mongoose.Types.ObjectId);
    })
  })
});
