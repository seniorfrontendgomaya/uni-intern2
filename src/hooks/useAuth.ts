"use client";

import { useAsyncAction } from "./useAsync";
import { login, logout, superLogin } from "@/services/auth.service";
import { LoginPayload, LoginResponse } from "@/services/auth.service";
import { useState } from "react";

export function useLogin() {
  const { run, loading } = useAsyncAction<LoginResponse>();
  const [data, setData] = useState<LoginResponse | null>(null);

  const loginUser = async (payload: LoginPayload) => {
    const res = await run(() => login(payload));
    if (res.ok && res.data) {
      setData(res.data);
    } else {
      setData(null);
    }
    return res;
  };

  console.log("login data", data);

  return {
    data,
    login: loginUser,
    loading,
  };
}

export function useSuperLogin() {
  const { run, loading } = useAsyncAction<LoginResponse>();
  const [data, setData] = useState<LoginResponse | null>(null);

  const loginUser = async (payload: LoginPayload) => {
    const res = await run(() => superLogin(payload));
    if (res.ok && res.data) {
      setData(res.data);
    } else {
      setData(null);
    }
    return res;
  };

  return {
    data,
    login: loginUser,
    loading,
  };
}

export function useLogout() {
  const { run, loading } = useAsyncAction<void>();
  const logout = async () => {
    await run(async () => await logout());
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };
  return { logout, loading };
}
