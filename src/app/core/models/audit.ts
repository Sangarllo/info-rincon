import { IUser } from 'src/app/core/models/user';
import { BaseType, IBase } from 'src/app/core/models/base';

export enum AuditType {
  CREATED = 'CREATED',
  UPDATED_INFO = 'UPDATED_INFO',
  UPDATED_STATUS = 'UPDATED_STATUS',
  DELETED = 'DELETED',
  LOGIN_EMAIL = 'LOGIN_EMAIL',
  LOGIN_PROVIDER = 'LOGIN_PROVIDER',
  LOGOUT = 'LOGOUT',
}

export interface IAuditItem {
  id: string;
  active: boolean;
  name: string;
  image: string;
  baseType: BaseType;
  auditType: AuditType;
  description: string;
  userId?: string;
  timestamp?: string;
}

export class AuditItem implements IAuditItem, IBase {

  public static IMAGE_DEFAULT = 'assets/images/audit/default.png';
  public static IMAGE_CREATED = 'assets/images/audit/created.png';
  public static IMAGE_UPDATED_INFO = 'assets/images/audit/updated-info.png';
  public static IMAGE_UPDATED_STATUS = 'assets/images/audit/updated-status.png';
  public static IMAGE_DELETED = 'assets/images/audit/deleted.png';
  public static IMAGE_LOGIN = 'assets/images/audit/login.png';
  public static IMAGE_LOGOUT = 'assets/images/audit/logout.png';

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public image: string,
    public baseType: BaseType,
    public auditType: AuditType,
    public description: string,
    public userId?: string,
    public timestamp?: string,
     ) {
  }

  static InitDefault(auditType: AuditType, user: any, timestamp: string, descExtra?: string): IAuditItem {

    let name = '';
    let image = AuditItem.IMAGE_DEFAULT;
    switch (auditType) {

      case AuditType.CREATED:
        name = `Creado en ${timestamp}`;
        image = AuditItem.IMAGE_CREATED;
        break;

      case AuditType.UPDATED_STATUS:
        name = `Modificada la visualización en ${timestamp}`;
        image = AuditItem.IMAGE_UPDATED_STATUS;
        break;

      case AuditType.UPDATED_INFO:
        name = `Modificada la información en ${timestamp}`;
        image = AuditItem.IMAGE_UPDATED_INFO;
        break;

      case AuditType.DELETED:
        name = `Borrado en ${timestamp}`;
        image = AuditItem.IMAGE_DELETED;
        break;

      case AuditType.LOGIN_PROVIDER:
        // this.logSrv.info(`user data: ${JSON.stringify(user)}`)
        const provider: string = ( user?.providerData ) ?
          user.providerData[0]?.providerId : '';
        name = `Acceso con ${provider ?? ''} en ${timestamp}`;
        image = AuditItem.IMAGE_LOGIN;
        break;

      case AuditType.LOGIN_EMAIL:
        name = `Acceso con email en ${timestamp}`;
        image = AuditItem.IMAGE_LOGIN;
        break;

      case AuditType.LOGOUT:
        name = `Cerró sesión en ${timestamp}`;
        image = AuditItem.IMAGE_LOGOUT;
        break;

      default:
        break;
    }

    return new AuditItem(
      '0',
      true,
      name,
      image,
      BaseType.AUDIT,
      auditType,
      descExtra ?? null,
      user.uid,
      timestamp,
    );
  }
}
