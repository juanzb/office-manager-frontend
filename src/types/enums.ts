export const Role = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
} as const;

export type Role = typeof Role[keyof typeof Role];

export const Permission = {
  // Usuarios
  READ_USERS: 'read_users',
  WRITE_USERS: 'write_users',
  DELETE_USERS: 'delete_users',

  // Herramientas
  READ_TOOLS: 'read_tools',
  WRITE_TOOLS: 'write_tools',
  DELETE_TOOLS: 'delete_tools',

  // Préstamos
  READ_LOANS: 'read_loans',
  WRITE_LOANS: 'read_loans',
  DELETE_LOANS: 'delete_loans',

  // Dashboard o funciones generales
  VIEW_REPORTS: 'view_reports',
  MANAGE_SETTINGS: 'manage_settings',
} as const;

export type Permission = typeof Permission[keyof typeof Permission];
