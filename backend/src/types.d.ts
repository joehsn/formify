import 'express';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface User {
      id: mongoose.Types.ObjectId;
      fullname: string;
      email: string;
    }
  }
}
