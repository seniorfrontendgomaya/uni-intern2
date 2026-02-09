import { api } from '@/lib/api';
import { BaseError } from '@/errors/BaseError';
import { ValidationError, UnauthorizedError } from '@/errors/http.errors';
import { InvalidCredentialsError } from '@/errors/domain.errors';

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user_type: "COMPANY" | "STUDENT" | "UNIVERSITY" | "SUPERADMIN" | string;
  token: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return await api<LoginResponse>("login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function superLogin(
  payload: LoginPayload
): Promise<LoginResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://inter.malspy.com/";
  const response = await fetch(`${baseUrl}super_login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await response.json().catch(() => ({}));

  if (!response.ok || !json?.token) {
    const message = json?.message || json?.detail || "Invalid credentials";
    throw new ValidationError({ message });
  }

  return {
    message: json?.message ?? "Login Successfully",
    user_type: "SUPERADMIN",
    token: json.token,
  };
}

export async function logout(): Promise<void> {
  return await api<void>("logout/", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
}