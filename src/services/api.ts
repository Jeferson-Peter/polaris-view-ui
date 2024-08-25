import axios, {AxiosError} from 'axios';
import config from "@/config";

const baseURL = process.env.NEXT_PUBLIC_APP_MODE !== 'prd'
  ? config.apiUrl
  : 'http://127.0.0.1:8000/api/';

export const api = axios.create({
  baseURL: baseURL,
});

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const errorData = axiosError.response.data;

      let errorMessage: string;

      if (typeof errorData === 'object' && errorData !== null) {
        errorMessage = Object.values(errorData as { [key: string]: string[] })
          .flat()
          .join(' ');
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else {
        errorMessage = 'An unknown error occurred';
      }

      throw new Error(errorMessage);
    } else if (axiosError.request) {
      throw new Error('No response received from the API');
    } else {
      throw new Error(`Request error: ${axiosError.message}`);
    }
  } else {
    throw new Error('An unknown error occurred');
  }
};
