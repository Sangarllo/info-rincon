import { IUser } from '@models/user';
import { UserRole } from '@app/shared/models/user-role.enum';

export class RoleValidator {
  isSuper(user: IUser): boolean {
    return user.role === UserRole.Super;
  }

  isAdmin(user: IUser): boolean {
    return user.role === UserRole.Admin;
  }

  isCensor(user: IUser): boolean {
    return user.role === UserRole.Censor;
  }

  isAutor(user: IUser): boolean {
    return user.role === UserRole.Autor;
  }

  isLector(user: IUser): boolean {
    return user.role === UserRole.Lector;
  }
}
