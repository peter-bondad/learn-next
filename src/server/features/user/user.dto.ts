import { z } from "zod";

export const userDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.enum(["admin", "user"]),
});

export type UserDto = z.infer<typeof userDtoSchema>;
