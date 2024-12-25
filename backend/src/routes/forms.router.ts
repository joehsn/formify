import { Router } from 'express';
import * as FormsController from '../controllers/forms.controller';
import isAuthenticated from '../middlewares/auth.middleware';

const router = Router();

router.use(isAuthenticated);

router.post('/', FormsController.createForm);

router.get('/', FormsController.getAllForms);

router.get('/:id', FormsController.getForm);

router.put('/:id', FormsController.updateForm);

router.delete('/:id', FormsController.deleteForm);

export default router;
