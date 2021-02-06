export enum UserRole {
  Super = 'SUPER',
  Admin = 'ADMIN',
  Censor = 'CENSOR',
  Autor = 'AUTOR',
  Lector = 'LECTOR'
}

const USER_ROLES: UserRole[] = [
  UserRole.Super,
  UserRole.Admin,
  UserRole.Censor,
  UserRole.Autor,
  UserRole.Lector,
];

export { USER_ROLES };
