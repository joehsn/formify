import axios from 'axios';
import { toast } from 'sonner';
import { FormType } from '@/types';
import { envVars } from './utils';
import { z } from 'zod';

/**
 * A utility function to logout the user.
 * @param onLogout - The function to call when the user is logged out.
 */
export const handleLogOut = async (onLogout: () => void) => {
  try {
    const req = await axios.post(
      `${envVars.VITE_API_URL}/users/logout`,
      null,
      {
        withCredentials: true,
      }
    );
    toast(req.data.message || "Logged out successfuly");
    onLogout();
  } catch (error) {
    console.error(error);
    toast('An error occurred while logging out');
  }
};

export const handleCreateForm = async (callback: (formId: string) => void) => {
  try {
    const req = await axios.post(`${envVars.VITE_API_URL}/forms/`, null, { withCredentials: true });
    callback(req.data.formId)
    toast('Form has been created successfully');
  } catch (error) {
    console.error("Error creating form:", error);
    toast('An error occurred while creating the form');
  }
}

/**
 * A utility function to save the form.
 * @param formId - The ID of the form.
 * @param form - The form data.
 */
export const handleSaveForm = async (formId: string, form: FormType) => {
  try {
    const response = await axios.post(
      `${envVars.VITE_API_URL}/forms/`,
      {
        id: formId,
        ...form,
      },
      {
        withCredentials: true,
      }
    );
    toast(response.data.message);
  } catch (error) {
    console.error(error);
    toast('An error occurred while saving the form');
  }
};

/**
 * A utility function to delete the form.
 * @param formId - The ID of the form.
 */
export const handleDeleteForm = async (formId: string) => {
  try {
    const response = await axios.delete(
      `${envVars.VITE_API_URL}/forms/${formId}`,
      {
        withCredentials: true,
      }
    );
    toast(response.data.message);
  } catch (error) {
    console.error(error);
    toast('An error occurred while deleting the form');
  }
};

/**
 * A utility function to update the form.
 * @param formId - The ID of the form.
 * @param form - The form data.
 */
export const handleUpdateForm = async (
  form: FormType
) => {
  try {
    const formId = z.string().uuid().parse(form._id);
    const response = await axios.put(
      `${envVars.VITE_API_URL}/forms/${formId}`,
      {
        ...form,
        updatedAt: new Date().toISOString(),
      },
      {
        withCredentials: true,
      }
    );
    toast(response.data.message);
  } catch (error) {
    console.error(error);
    toast('An error occurred while updating the form');
  }
};

/**
 * A utility function to save the response.
 * @param formId - The ID of the form.
 * @param response - The response data.
 */
export const handleSaveResponse = async (
  formId: string,
  responseData: Record<string, string | string[]>
) => {
  const { email, ...answers } = responseData;
  try {
    const response = await axios.post(
      `${envVars.VITE_API_URL}/responses/${formId}/`,
      {
        email: email,
        answers: answers,
      },
      {
        withCredentials: true,
      }
    );
    toast(response.data.message);
  } catch (error) {
    console.error(error);
    toast('An error occurred while saving the response');
  }
};
