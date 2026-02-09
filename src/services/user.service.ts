// src/services/user.service.ts
import { api } from '@/lib/api';
import { IUser } from '@/types/users';

export const getProfile = () => api<IUser>('/users/me');

export const updateProfile = (data: Partial<IUser>) =>
  api<IUser>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
