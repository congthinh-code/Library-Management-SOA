export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  READER: 'READER',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
