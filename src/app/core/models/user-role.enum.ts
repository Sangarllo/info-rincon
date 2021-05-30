// eslint-disable-next-line no-shadow
export enum UserRole {
  Super = 'SUPER',
  Admin = 'ADMIN',
  Autor = 'AUTOR',
  Lector = 'LECTOR'
}

const USER_ROLES: UserRole[] = [
  UserRole.Super,
  UserRole.Admin,
  UserRole.Autor,
  UserRole.Lector,
];

export { USER_ROLES };
