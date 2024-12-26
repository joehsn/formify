import express from 'express';
import * as ResponsesController from '../controllers/responses.controller';

const router = express.Router();

router.post('/:formId', ResponsesController.createResponse);

router.get('/:formId', ResponsesController.getResponsesByForm);

router.get('/:formId/:responseId', ResponsesController.getResponseById);

export default router;
