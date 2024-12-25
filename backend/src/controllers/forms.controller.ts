import { Request, Response } from 'express';
import Form from '../models/form.model'; // Assume this is the Mongoose model for forms
import createHttpError from 'http-errors';
import logger from '../utils/logger';
import { validate } from 'uuid';
import formSchema from '../lib/schemas/form.schema';

/**
 * @brief Create a new form.
 * @param req The HTTP request containing form data in the body.
 * @param res The HTTP response.
 */
export const createForm = async (req: Request, res: Response) => {
  try {
    const data = formSchema.parse(req.body);
    const userId = req.user !== undefined && 'id' in req.user && req.user.id; // I did this extra checking because of Typescript but `id` for sure exists on the `req.user` because this route is protected
    const form = new Form({ ...data, userId });
    const savedForm = await form.save();
    res.status(201).json({
      message: 'Form created successfully',
      form: savedForm,
    });
  } catch (error) {
    logger.error('Error creating form: ' + error);
    res.status(500).json({ message: 'Error creating form', error });
    throw createHttpError(500, 'Error creating form' + error);
  }
};

/**
 * @brief Retrieve all forms.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
export const getAllForms = async (_req: Request, res: Response) => {
  try {
    const forms = await Form.find().lean().exec();
    res.status(200).json(forms);
  } catch (error) {
    logger.error('Error retrieving forms: ' + error);
    res.status(500).json({ message: 'Error retrieving forms', error });
  }
};

/**
 * @brief Retrieve a form by ID.
 * @param req The HTTP request containing the form ID in the parameters.
 * @param res The HTTP response.
 */
export const getForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!validate(id)) {
      res.status(400).json({
        message: 'Invalid form ID',
      });
      throw createHttpError(400, 'Invalid form ID');
    }
    const form = await Form.findOne({ id }).lean().exec();
    if (!form) {
      throw createHttpError(404, 'Form not found');
    }
    res.status(200).json(form);
  } catch (error) {
    logger.error('Error retrieving a form: ' + error);
    res.status(500).json(error);
  }
};

/**
 * @brief Update a form by ID.
 * @param req The HTTP request containing the form ID in the parameters and updated data in the body.
 * @param res The HTTP response.
 */
export const updateForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!validate(id)) {
      throw createHttpError(400, 'Invalid form ID');
    }
    const updatedForm = await Form.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();
    if (!updatedForm) {
      throw createHttpError(404, 'Form not found');
    }
    res.status(200).json({
      message: 'Form updated successfully',
      form: updatedForm,
    });
  } catch (error) {
    logger.error('Error updating form: ' + error);
    res.status(500).json({ message: error });
  }
};

/**
 * @brief Delete a form by ID.
 * @param req The HTTP request containing the form ID in the parameters.
 * @param res The HTTP response.
 */
export const deleteForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!validate(id)) {
      throw createHttpError(400, 'Invalid form ID');
    }
    const deletedForm = await Form.findByIdAndDelete(id).lean().exec();
    if (!deletedForm) {
      throw createHttpError(404, 'Form not found');
    }
    res.status(200).json({
      message: 'Form deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting form: ' + error);
    res.status(500).json({ message: error });
  }
};
