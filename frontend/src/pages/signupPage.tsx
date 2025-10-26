import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import { useActionState, useEffect, useState } from "react";
import { signupAction } from "../lib/actions/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { User as UserType } from "../types";
import { useAuthStore } from "../store/useAuthStore";

type InitialStateType = {
  success: boolean;
  message: string;
  errors: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  userData?: UserType;
};
const initialState: InitialStateType = {
  success: false,
  message: "",
  errors: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  data: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  userData: undefined,
};
const SignupPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, action, isPending] = useActionState(signupAction, initialState);
  useEffect(() => {
    console.log(state);
    if (state.apiError) {
      toast.error(state.apiError);
    }
    if (state.success) {
      setUser(state.userData);
      toast.success("You Registered Successfully");
      navigate("/", { replace: true });
    }
  }, [state]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>
          <form action={action} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full`}
                  placeholder="John Doe"
                  name="fullName"
                  defaultValue={state.data.fullName as string}
                />
              </div>
              {state?.errors?.fullName && (
                <span className="text-red-600 dark:text-red-400 text-sm mt-2 block">
                  {state?.errors.fullName}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full`}
                  placeholder="you@example.com"
                  name="email"
                  defaultValue={state.data.email as string}
                />
              </div>
              {state?.errors?.email && (
                <span className="text-red-600 dark:text-red-400 text-sm mt-2 block">
                  {state?.errors.email}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full`}
                  placeholder="••••••••"
                  name="password"
                  defaultValue={state.data.password as string}
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {state?.errors?.password && (
                <span className="text-red-600 dark:text-red-400 text-sm mt-2 block">
                  {state?.errors.password}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full`}
                  placeholder="••••••••"
                  name="confirmPassword"
                  defaultValue={state.data.confirmPassword as string}
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {state?.errors?.confirmPassword && (
                <span className="text-red-600 dark:text-red-400 text-sm mt-2 block">
                  {state?.errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignupPage;
