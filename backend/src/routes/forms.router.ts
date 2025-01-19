import { Router } from 'express';
import * as FormsController from '../controllers/forms.controller';
import isAuthenticated from '../middlewares/auth.middleware';

const router = Router();

router.get('/:formId', FormsController.getForm);

router.use(isAuthenticated);

router.post('/', FormsController.createForm);

router.get('/', FormsController.getAllFormsByUser);

router.put('/:formId', FormsController.updateForm);

router.delete('/:formId', FormsController.deleteForm);

export default router;
