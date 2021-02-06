import { UserRole, USER_ROLES } from '@models/user-role.enum';
import { IEntity } from '@models/entity';

export interface IUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  active?: boolean;
  displayName?: string;
  password?: string;
  photoURL?: string;
  role?: UserRole;
  entitiesAdmin?: IEntity[];
}

export class User implements IUser {

  public static IMAGE_DEFAULT = 'assets/images/users/default.png';
  public static PATH_URL = 'usuarios';
  public static ROLES: UserRole[] = USER_ROLES;

  constructor(
    public uid: string,
    public active: boolean,
    public email: string,
    public emailVerified: boolean,
    public displayName?: string,
    public password?: string,
    public photoURL?: string,
    public role?: UserRole,
    public entitiesAdmin?: IEntity[],
     ) {
  }

  static InitDefault(): User {
    return new User(
      '0',
      true,
      '',
      false,
      '',
      '',
      User.IMAGE_DEFAULT,
      UserRole.Lector
    );
  }
}
