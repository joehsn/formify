import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema(
  {
    responseId: {
      type: mongoose.Schema.Types.UUID,
      unique: true,
      required: true,
    },
    formId: {
      type: mongoose.Schema.Types.UUID,
      ref: 'Form',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    answers: [
      {
        fieldId: {
          type: String,
          required: true,
        },
        value: {
          type: mongoose.Schema.Types.Mixed, // Supports various data types
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Response = mongoose.model('Response', responseSchema);
export default Response;
