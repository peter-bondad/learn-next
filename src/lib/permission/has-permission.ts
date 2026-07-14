import { UserRole } from "@/server/shared/user-role.types";
import { Permission, Resource } from "./permissions";

const rolePermissions: Record<UserRole, Permission> = {
  owner: {
    user: ["create", "read", "update", "delete"],
    invitation: ["create", "read", "delete"],
    menu: ["create", "read", "update", "delete"],
    inventory: ["create", "read", "update", "delete"],
    order: ["create", "read", "update"],
    report: ["read"],
  },

  manager: {
    user: ["read", "update"],

    invitation: ["create", "read"],

    menu: ["create", "read", "update"],

    inventory: ["read", "update"],

    order: ["create", "read", "update"],

    report: ["read"],
  },

  staff: {
    menu: ["read"],

    inventory: ["read"],

    order: ["create", "read", "update"],
  },
};

export function hasPermission(role: UserRole, required: Permission) {
  const granted = rolePermissions[role];

  return (Object.keys(required) as Resource[]).every((resource) => {
    const requiredActions = required[resource] ?? [];

    const allowedActions = granted[resource] ?? [];

    return requiredActions.every((action) => allowedActions.includes(action));
  });
}
