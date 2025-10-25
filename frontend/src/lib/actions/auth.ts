"use server";

import { api } from "../axios";
import { SignupSchema } from "../schema/auth";

const signupAction = async (prev: any, formData: FormData) => {
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
    const res = await api.post("/auth/signup", { body: signupData });
    return {
      success: true,
      message: "Signup successful",
      data: signupData,
      errors: { fullName: "", email: "", password: "", confirmPassword: "" },
    };
  } catch (error: any) {
    console.log("errors", error);
    return {
      success: false,
      message: "",
      data: signupData,
      errors: error.errors || {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      apiError: error.message || "Please try again later",
    };
  }
};

export { signupAction };
