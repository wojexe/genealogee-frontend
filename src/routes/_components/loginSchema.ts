import { object, email, string, never, maxLength, minLength } from "valibot";

export const loginSchema = object(
  {
    email: string([email()]),
    password: string([minLength(8), maxLength(1024)]),
  },
  never(),
);

export type LoginSchema = typeof loginSchema;
