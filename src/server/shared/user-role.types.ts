export const userRole = {
  Owner: "owner",
  Manager: "manager",
  Staff: "staff",
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];

export function isUserRole(role: unknown): role is UserRole {
  return Object.values(userRole).includes(role as UserRole);
}
