import mongoose, { InferSchemaType } from 'mongoose';

const fieldSchema = new mongoose.Schema({
  fieldLabel: {
    type: String,
    required: true,
    maxLength: 255,
  },
  fieldType: {
    type: String,
    enum: [
      'text',
      'paragraph',
      'email',
      'number',
      'radio',
      'checkbox',
      'dropdown',
      'date',
      'time',
      'rating',
    ],
    required: true,
  },
  fieldOptions: [String],
  fieldRequired: {
    type: Boolean,
    default: false,
  },
  fieldValidations: {
    maxLengthValidation: {
      type: Number,
    },
    minLengthValidation: {
      type: Number,
    },
    patternValidation: {
      type: String,
    },
  },
});

const formSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: () => new mongoose.Types.UUID(),
    },
    formTitle: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    formDesc: {
      type: String,
      trim: true,
      default: '',
      maxLength: 1020,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    formFields: [fieldSchema],
    formStatus: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model('forms', formSchema);

export type IForm = InferSchemaType<typeof formSchema>;

export default Form;
