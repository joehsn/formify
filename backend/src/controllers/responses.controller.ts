import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import ResponseModel from '../models/response.model';
import Form from '../models/form.model';
import responseSchema from '../lib/schemas/response.schema';
import logger from '../utils/logger';
import { validate } from 'uuid';

/**
 * @function createResponse
 * @description Creates a new response for a specified form.
 * This function accepts a form ID from the request parameters and the response data from the request body.
 * It validates the response data using a Zod schema and then saves the response to the database.
 * If the form with the specified ID does not exist, it returns a 404 status with a relevant message.
 * If an error occurs during the process, a 500 status code is thrown with an error message.
 *
 * @param req - The Express request object, containing the form ID in the URL params and the response data in the body.
 * @param res - The Express response object used to send the response back to the client.
 *
 * @returns - Responds with a JSON object containing a success message and the newly created response.
 *
 * @throws - Throws an HTTP error if an issue occurs during the process, such as invalid data or database errors.
 */
export const createResponse = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const response = responseSchema.parse({
      ...req.body,
      formId,
    });

    const form = await Form.findOne({ id: formId });

    if (!form) {
      res.status(404).json({ message: 'Form not found.' });
      return;
    }

    const newResponse = new ResponseModel(response);

    await newResponse.save();
    res.status(201).json({
      message: 'Response created successfully.',
      response: newResponse,
    });
  } catch (error) {
    logger.error(error);
    throw createHttpError(
      500,
      'An error occurred while creating the response.'
    );
  }
};

/**
 * @function getResponsesByForm
 * @description Retrieves all responses associated with a specific form.
 * This function accepts a form ID from the request parameters, validates it, and then fetches all responses for that form from the database.
 * If the form ID is invalid, it returns a 400 status with an error message.
 * In case of an error while fetching the responses, a 500 status code is thrown with an error message.
 *
 * @param req - The Express request object, containing the form ID in the URL params.
 * @param res - The Express response object used to send the list of responses back to the client.
 *
 * @returns - Responds with a JSON array containing all the responses associated with the form.
 *
 * @throws - Throws an HTTP error if an issue occurs during the process, such as invalid form ID or database errors.
 */
export const getResponsesByForm = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;

    if (!validate(formId)) {
      res.status(400).json({ message: 'Invalid formId.' });
      return;
    }

    const responses = await ResponseModel.find({ formId }).lean();

    res.status(200).json(responses);
  } catch (error) {
    logger.error(error);
    throw createHttpError(500, 'An error occurred while retrieving responses.');
  }
};

/**
 * @function getResponseById
 * @description Retrieves a specific response by its ID.
 * This function accepts the form ID and response ID from
 * the request parameters, validates them, and then fetches the response from the database.
 *
 * If the response is not found, it returns a 404 status with a relevant message.
 * If an error occurs during the process, a 500 status code is thrown with an error message.
 *
 * @param req - The Express request object, containing the form ID and response ID in the URL params.
 * @param res - The Express response object used to send the response back to the client.
 * @returns - Responds with a JSON object containing the response data.
 * @throws - Throws an HTTP error if an issue occurs during the process, such as invalid IDs or database errors.
 */
export const getResponseById = async (req: Request, res: Response) => {
  try {
    const { formId, responseId } = req.params;

    if (!validate(formId) || !validate(responseId)) {
      res.status(400).json({ message: 'Invalid formId or responseId.' });
      return;
    }

    const response = await ResponseModel.findOne({
      formId,
      responseId,
    }).lean();

    if (!response) {
      res.status(404).json({ message: 'Response not found.' });
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    throw createHttpError(
      500,
      'An error occurred while retrieving the response.'
    );
  }
};
