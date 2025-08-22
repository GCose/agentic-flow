export interface User {
  id: number;
  firstname: string;
  othername: string;
  lastname: string;
  email: string;
  avatar?: string;
  status: string;
  userOrgMemberships: UserOrgMembership[];
  profile?: {
    id: number;
  };
  metadata?: UserMetadata[];
}

export interface UserOrgMembership {
  id: number;
  org: Organization;
  orgType: string; // direct access for membership
  apps: string[];
  membershipState: number;
  roles: Role[];
  permission: Permission[];
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  services: string[];
  status: string;
  orgType: string;
}

export interface Role {
  id: number;
  roleLabel: string;
  roleName: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  permissionKey: string;
}

export interface UserMetadata {
  id: number;
  key: string;
  value: string;
}

export type UserRole = "Administrator" | "Organization" | "Designer" |"Videographer" | "HR";
