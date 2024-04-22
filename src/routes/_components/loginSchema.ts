import { email, maxLength, minLength, never, object, string } from "valibot";

export const loginSchema = object(
  {
    email: string([email()]),
    password: string([minLength(8), maxLength(1024)]),
  },
  never(),
);

export type LoginSchema = typeof loginSchema;
