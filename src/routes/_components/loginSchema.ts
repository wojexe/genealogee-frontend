import {
  email,
  maxLength,
  minLength,
  pipe,
  strictObject,
  string,
} from "valibot";

export const loginSchema = strictObject({
  email: pipe(string(), email()),
  password: pipe(string(), minLength(8), maxLength(1024)),
});

export type LoginSchema = typeof loginSchema;
