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
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const Response = mongoose.model('Response', responseSchema);
export default Response;
