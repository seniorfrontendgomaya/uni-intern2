// src/lib/toast.ts
import toast from 'react-hot-toast';

export const showErrorToast = (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('Something went wrong');
  }
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};
