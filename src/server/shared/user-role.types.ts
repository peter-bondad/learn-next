export const userRole = {
  Owner: "owner",
  Manager: "manager",
  Staff: "staff",
} as const;

// access to the value of each key of userrole
export type UserRole = (typeof userRole)[keyof typeof userRole];

// access to key of userRole object
export type UserString = keyof typeof userRole;

export const userRoleLabels: Record<UserRole, UserString> = {
  owner: "Owner",
  manager: "Manager",
  staff: "Staff",
};

export function isUserRole(role: unknown): role is UserRole {
  return Object.values(userRole).includes(role as UserRole);
}
