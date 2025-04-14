import mongoose from 'mongoose';
import { describe } from 'mocha';
import { expect } from 'chai';
import Response from '../../models/response.model';
import { v4 as uuidv4 } from 'uuid';

const testDbUrl = 'mongodb://localhost:27017/formify-test';

describe('Response Model', () => {
  before(async () => {
    try {
      await mongoose.connect(testDbUrl);
    } catch (error) {
      console.error('Error connecting to test database:', error);
    }
  });

  beforeEach(async () => {
    try {
      await Response.deleteMany({});
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

  it('Creating a fake Response', async () => {
    try {
      const nResponse = new Response({
        formId: uuidv4(),
        email: 'test@example.com',
        answers: {
          '1': 'one',
          '2': 'two',
        },
      });
      const frm = await nResponse.save();
      expect(frm._id).to.be.string;
    } catch (error) {
      console.error('Error creating user:', error);
    }
  });
});
