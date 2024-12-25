import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password should be at least 6 characters long'],
    select: false,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model('users', userSchema);

export type IUser = InferSchemaType<typeof userSchema>;

export default User;
