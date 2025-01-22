import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { FormType, User } from '@/types';
import { envVars } from './utils';
import { z } from 'zod';
import { LoginType } from './schemas/login.schema';
import { RegisterType } from './schemas/register.schema';

export const handleRegister = async (
  data: RegisterType,
  onRegister: () => void
) => {
  try {
    const response = await axios.post(
      `${envVars.VITE_API_URL}/users/register`,
      {
        fullname: data.name,
        email: data.email,
        password: data.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    toast({
      title: 'Account created',
      description: response.data.message,
      duration: 5000,
    });
    onRegister();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast({
        title: error.response?.statusText || 'Error',
        description: error.response?.data?.message || 'An error occurred',
        duration: 5000,
        variant: 'destructive',
      });
    } else {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred while creating your account',
        duration: 5000,
        variant: 'destructive',
      });
    }
  }
};

/**
 * A utility function to login the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @param onLogin - The function to call when the user is logged in.
 */
export const handleLogIn = async (
  data: LoginType,
  onLogin: (user: User) => void
) => {
  try {
    const response = await axios.post(
      `${envVars.VITE_API_URL}/users/login`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    toast({
      title: 'Logged in',
      description: response.data.message,
      duration: 5000,
    });
    onLogin(response.data.user);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast({
        title: error.response?.statusText || 'Error',
        description: error.response?.data?.message || 'An error occurred',
        duration: 5000,
        variant: 'destructive',
      });
    } else {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred while logging in',
        duration: 5000,
        variant: 'destructive',
      });
    }
  }
};

/**
 * A utility function to logout the user.
 * @param onLogout - The function to call when the user is logged out.
 */
export const handleLogOut = async (onLogout: () => void) => {
  try {
    const response = await axios.post(
      `${envVars.VITE_API_URL}/users/logout`,
      null,
      {
        withCredentials: true,
      }
    );
    toast({
      title: 'Logged out',
      description: response.data.message,
      duration: 5000,
    });
    onLogout();
  } catch (error) {
    console.error(error);
    toast({
      title: 'Error',
      description: 'An error occurred while logging out',
      duration: 5000,
      variant: 'destructive',
    });
  }
};

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
    toast({
      title: 'Form saved',
      description: response.data.message,
      duration: 5000,
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Error saving form',
      description: 'An error occurred while saving the form',
      duration: 5000,
      variant: 'destructive',
    });
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
    toast({
      title: 'Form deleted',
      description: response.data.message,
      duration: 5000,
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Error deleting form',
      description: 'An error occurred while deleting the form',
      duration: 5000,
      variant: 'destructive',
    });
  }
};

/**
 * A utility function to update the form.
 * @param formId - The ID of the form.
 * @param form - The form data.
 */
export const handleUpdateForm = async (
  form: FormType & {
    id: string;
  }
) => {
  const formId = z.string().uuid().parse(form.id);
  try {
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
    toast({
      title: 'Form updated',
      description: response.data.message,
      duration: 5000,
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Error updating form',
      description: 'An error occurred while updating the form',
      duration: 5000,
      variant: 'destructive',
    });
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
    toast({
      title: 'Response saved',
      description: response.data.message,
      duration: 5000,
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Error saving response',
      description: 'An error occurred while saving the response',
      duration: 5000,
      variant: 'destructive',
    });
  }
};
