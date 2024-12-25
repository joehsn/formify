import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.UUID,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fields: [
    {
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: [
          "text",
          "email",
          "number",
          "radio",
          "checkbox",
          "dropdown",
          "date",
        ],
        required: true,
      },
      options: [
        {
          type: String,
        },
      ],
      required: {
        type: Boolean,
        default: false,
      },
      validations: {
        maxLength: {
          type: Number,
        },
        minLength: {
          type: Number,
        },
        pattern: {
          type: String,
        },
      },
    },
  ],
  status: {
    type: String,
    enum: ["draft", "published", "closed"],
    default: "draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Form = mongoose.model("forms", formSchema);

export default Form;
