import express from 'express';
import * as ResponsesController from '../controllers/responses.controller';

const router = express.Router();

router.post('/:formId', ResponsesController.createResponse);

router.get('/:formId', ResponsesController.getResponsesByForm);

export default router;
