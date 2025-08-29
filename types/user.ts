
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password?: string | null;
  setupToken?: string | null;
  notificationEnabled?: boolean;
  verifyToken?: string | null;
  verified?: boolean;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
  emailStatus?: string | null;
  systems?: string[];
}

export type UserRole = "admin" | "videographer" | "designer" | "client";
