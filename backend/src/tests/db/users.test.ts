import mongoose from 'mongoose';
import { describe } from 'mocha';
import { expect } from 'chai';
import User from '../../models/user.model';
import { hashPass } from '../../utils';
import bcrypt from 'bcrypt';

const testDbUrl = 'mongodb://localhost:27017/formify-test';

describe('User Model', () => {
  before(async () => {
    try {
      await mongoose.connect(testDbUrl);
    } catch (error) {
      console.error('Error connecting to test database:', error);
    }
  });

  beforeEach(async () => {
    try {
      await User.deleteMany({});
    } catch (error) {
      console.error('Error clearing test database:', error);
    }
  });

  after(async () => {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error disconnecting from test database:', error);
    }
  });

  it('Creating a fake user', async () => {
    try {
      const password = await hashPass('1q2w3e4r');
      const nUser = new User({
        email: 'abc@outlook.com',
        fullname: 'Aaa Bbb Ccc',
        password,
      });
      const usr = await nUser.save();
      expect(usr._id).to.be.string;
      expect(usr.fullname).to.equal('Aaa Bbb Ccc');
      expect(await bcrypt.compare('1q2w3e4r', usr.password)).to.be.true;
    } catch (error) {
      console.error('Error creating user:', error);
    }
  });
});
