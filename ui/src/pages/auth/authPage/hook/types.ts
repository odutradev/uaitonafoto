import type { FormEvent } from "react";
import type { AuthMode } from "@pages/auth/authPage/types";

export interface UseAuthPageReturn {
  mode: AuthMode;
  isSignUp: boolean;
  setMode: (mode: AuthMode) => void;
  toggleMode: () => void;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
  submitting: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
}
