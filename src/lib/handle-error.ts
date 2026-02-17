// src/lib/handle-error.ts
import toast from 'react-hot-toast';
import { BaseError } from '@/errors/BaseError';
import {
  UnauthorizedError,
  ForbiddenError,
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
    // Check if this is a login attempt (no token) vs session expiration (has token)
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');
    
    if (hasToken) {
      // Session expired - clear auth and redirect
      toast.error('Please login again');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        const shouldRedirect = window.location.pathname !== '/';
        if (shouldRedirect) {
          window.setTimeout(() => {
            window.location.assign('/');
          }, 1500);
        }
      }
    } else {
      // Login attempt failed - don't redirect or clear storage
      // The error message will be handled by the login form
      // Don't show toast here as login forms handle their own error messages
    }
    return;
  }

  if (error instanceof ForbiddenError) {
    toast.error(error.message);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      if (window.location.pathname !== '/') {
        window.setTimeout(() => {
          window.location.assign('/');
        }, 1500);
      }
    }
    return;
  }

  // Validation
  if (error instanceof ValidationError) {
    const meta = error.meta as { message?: unknown } | undefined;
    const isFieldLevel =
      Boolean(meta?.message) &&
      typeof meta?.message === 'object' &&
      !Array.isArray(meta?.message);

    // For 422 / field-level validation, forms should render errors inline.
    if (error.status === 422 || isFieldLevel) return;

    toast.error(error.message);
    return;
  }

  // Default
  toast.error(error.message);
}
