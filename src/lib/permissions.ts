import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  project: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  project: ["read"],
});

export const admin = ac.newRole({
  project: ["create", "read", "update", "delete"],
});
