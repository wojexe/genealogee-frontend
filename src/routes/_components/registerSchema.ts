import { email, maxLength, minLength, never, object, string } from "valibot";

export const registerSchema = object(
  {
    email: string([email()]),
    name: string([minLength(1), maxLength(64)]),
    password: string([minLength(8), maxLength(1024)]),
  },
  never(),
);

export type RegisterSchema = typeof registerSchema;
