import { zValidator } from "@hono/zod-validator";
import type { ZodSchema } from "zod";
import { ValidationError } from "./application.error";

export function validator<T extends ZodSchema>(
  target: "json" | "query" | "param",
  schema: T,
) {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new ValidationError(result.error);
    }
  });
}
