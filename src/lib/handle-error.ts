// src/lib/handle-error.ts
import toast from 'react-hot-toast';
import { BaseError } from '@/errors/BaseError';
import {
  UnauthorizedError,
  ValidationError,
} from '@/errors/http.errors';

export function handleError(error: unknown) {
  // Non-app errors
  if (!(error instanceof BaseError)) {
    toast.error('Unexpected error occurred');
    return;
  }

  // Auth
  if (error instanceof UnauthorizedError) {
    toast.error('Please login again');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      const shouldRedirect = window.location.pathname !== '/login';
      if (shouldRedirect) {
        window.setTimeout(() => {
          window.location.assign('/login');
        }, 1500);
      }
    }
    return;
  }

//   if (error instanceof ForbiddenError) {
//     toast.error('You do not have permission');
//     return;
//   }

  // Validation
  if (error instanceof ValidationError) {
    toast.error(error.message);
    return;
  }

  // Default
  toast.error(error.message);
}
