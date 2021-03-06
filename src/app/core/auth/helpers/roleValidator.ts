import { IUser } from '@models/user';
import { UserRole } from '@models/user-role.enum';

export class RoleValidator {
  isSuper(user: IUser): boolean {
    return user.role === UserRole.Super;
  }

  isAdmin(user: IUser): boolean {
    return user.role === UserRole.Admin;
  }

  isAutor(user: IUser): boolean {
    return user.role === UserRole.Autor;
  }

  isLector(user: IUser): boolean {
    return user.role === UserRole.Lector;
  }
}
