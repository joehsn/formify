import mongoose, { InferSchemaType } from 'mongoose';

const responseSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: () => new mongoose.Types.UUID(),
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

export type IResponse = InferSchemaType<typeof responseSchema>;

export default Response;
