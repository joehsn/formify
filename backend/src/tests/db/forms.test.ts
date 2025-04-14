import mongoose from 'mongoose';
import { describe } from 'mocha';
import { expect } from 'chai';
import Form from '../../models/form.model';

const testDbUrl = 'mongodb://localhost:27017/formify-test';

describe('Form Model', () => {
  before(async () => {
    try {
      await mongoose.connect(testDbUrl);
    } catch (error) {
      console.error('Error connecting to test database:', error);
    }
  });

  beforeEach(async () => {
    try {
      await Form.deleteMany({});
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

  it('Creating a fake Form', async () => {
    try {
      const nForm = new Form({
        userId: '67f95f98baa56ef1e40eab9a',
        formTitle: 'Test Form',
        formStatus: 'draft',
        formFields: [
          {
            fieldLabel: 'first question label?',
            fieldType: 'text',
            fieldRequird: true,
          },
          {
            fieldLabel: 'second question label?',
            fieldType: 'text',
            fieldRequird: false,
          },
        ],
      });
      const frm = await nForm.save();
      expect(frm._id).to.be.string;
    } catch (error) {
      console.error('Error creating user:', error);
    }
  });

  it('Form title cannot be more than 255 chars', async () => {
    try {
      const nForm = new Form({
        userId: '67f95f98baa56ef1e40eab9a',
        formTitle:
          'Test Form Test Form Test  Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form  Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form Test Form ',
        formStatus: 'draft',
        formFields: [
          {
            fieldLabel: 'first question label?',
            fieldType: 'text',
            fieldRequird: true,
          },
          {
            fieldLabel: 'second question label?',
            fieldType: 'text',
            fieldRequird: false,
          },
        ],
      });
      await nForm.save();
    } catch (error) {
      expect(error).to.be.instanceOf(mongoose.Error.ValidationError);
    }
  });
});
