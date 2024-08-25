import {
  email,
  maxLength,
  minLength,
  pipe,
  strictObject,
  string,
} from "valibot";

export const registerSchema = strictObject({
  email: pipe(string(), email()),
  name: pipe(string(), minLength(1), maxLength(64)),
  password: pipe(string(), minLength(8), maxLength(1024)),
});

export type RegisterSchema = typeof registerSchema;
