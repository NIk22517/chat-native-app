import type { User } from "@prisma/client";
import { t } from "elysia";

export type AuthSignUp = {
  data: Pick<User, "name" | "email" | "password">;
};

export type AuthSignIn = {
  data: Pick<User, "email" | "password">;
};

export type ApiResponse<T> = {
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
};

export const validateName = t.String({
  minLength: 3,
  description: "Username is required",
});

export const validateEmail = t.String({
  description: "Email is required",
  pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
});

export const validatePassword = t.String({
  minLength: 6,
  description: "Password is required",
});
