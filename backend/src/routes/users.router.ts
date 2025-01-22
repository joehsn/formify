import express from 'express';
import * as UserController from '../controllers/users.controller';
import { authenticate } from '../utils';

const router = express.Router();

router.get('/', UserController.getUser);

router.post('/register', UserController.register);

router.post('/login', authenticate, UserController.login);

router.post('/logout', UserController.logout);

export default router;
