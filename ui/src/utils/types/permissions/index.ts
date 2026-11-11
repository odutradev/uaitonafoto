export type Permission = "manage_platform" | "view_all_logs";

export type PageAccess = "public" | "guest" | "private";

export interface PageMetadata {
  access: PageAccess;
  requiredPermissions?: Permission[];
}
