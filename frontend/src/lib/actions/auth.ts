"use server";

import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../axios";
import { LoginSchema, SignupSchema } from "../schema/auth";

const loginAction = async (_: any, formData: FormData) => {
  const loginData = {
    email: formData.get("email") || "",
    password: formData.get("password") || "",
  };

  const result = LoginSchema.safeParse(loginData);
  if (!result.success) {
    const errors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (!errors[field as string]) {
        errors[field as string] = issue.message;
      }
    });
    return {
      success: false,
      errors,
      data: loginData,
    };
  }
  try {
    const res = await api.post("/auth/login", loginData);
    const userData = res.data.data;
    const { setUser, connectSocket } = useAuthStore.getState();
    setUser(userData);
    connectSocket();
    return {
      success: true,
      data: loginData,
      userData: userData,
      errors: { email: "", password: "" },
    };
  } catch (error: any) {
    console.log("errors", error);
    return {
      success: false,
      data: loginData,
      apiError: error.message || "Please try again later",
    };
  }
};

const signupAction = async (_: any, formData: FormData) => {
  const signupData = {
    fullName: formData.get("fullName") ?? "",
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
    confirmPassword: formData.get("confirmPassword") ?? "",
  };
  const result = SignupSchema.safeParse(signupData);
  if (!result.success) {
    const errors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (!errors[field as string]) {
        errors[field as string] = issue.message;
      }
    });
    return {
      success: false,
      errors,
      data: signupData,
    };
  }
  try {
    const res = await api.post("/auth/signup", signupData);
    const userData = res.data.data;
    const { setUser, connectSocket } = useAuthStore.getState();
    setUser(userData);
    connectSocket();
    return {
      success: true,
      message: "Signup successful",
      data: signupData,
      userData: res.data.data,
      errors: { fullName: "", email: "", password: "", confirmPassword: "" },
    };
  } catch (error: any) {
    console.log("errors", error);
    return {
      success: false,
      message: "",
      data: signupData,

      apiError: error.message || "Please try again later",
    };
  }
};

export { signupAction, loginAction };
