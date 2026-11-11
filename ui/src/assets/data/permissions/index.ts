import type { Permission } from "@utils/types/permissions";

export const rolePermissions: Record<string, Permission[]> = {
  admin: ["manage_platform", "view_all_logs"],
  user: []
};
