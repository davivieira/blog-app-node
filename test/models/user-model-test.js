const expect = require('chai').expect;
const UserModel = require('../../models/user-model');
const User = require('../../schemas/user');

describe('UNIT test: UserModel', () => {
  it('Should encrypt user\'s password.', () => {
    const user = new User({
      name: 'Test',
      email: "Test@email.com",
      username: "testuser",
      password: "123456"
    });

    expect(UserModel._encryptPassword(user.password).length).to.equal(60);
  });
});