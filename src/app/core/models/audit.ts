import { BaseType, IBase } from '@models/base';

// eslint-disable-next-line no-shadow
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
  imageId: string;
  imagePath: string;
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
    public imageId: string,
    public imagePath: string,
    public baseType: BaseType,
    public auditType: AuditType,
    public description: string,
    public userId?: string,
    public timestamp?: string,
     ) {
  }

  static InitDefault(auditType: AuditType, user: any, timestamp: string, descExtra?: string): IAuditItem {

    let name = '';
    let imageId = AuditItem.IMAGE_DEFAULT;
    let imagePath = AuditItem.IMAGE_DEFAULT;
    switch (auditType) {

      case AuditType.CREATED:
        name = `Creado en ${timestamp}`;
        imageId = AuditItem.IMAGE_CREATED;
        imagePath = AuditItem.IMAGE_CREATED;
        break;

      case AuditType.UPDATED_STATUS:
        name = `Modificada la visualización en ${timestamp}`;
        imageId = AuditItem.IMAGE_UPDATED_STATUS;
        imagePath = AuditItem.IMAGE_UPDATED_STATUS;
        break;

      case AuditType.UPDATED_INFO:
        name = `Modificada la información en ${timestamp}`;
        imageId = AuditItem.IMAGE_UPDATED_INFO;
        imagePath = AuditItem.IMAGE_UPDATED_INFO;
        break;

      case AuditType.DELETED:
        name = `Borrado en ${timestamp}`;
        imageId = AuditItem.IMAGE_DELETED;
        imagePath = AuditItem.IMAGE_DELETED;
        break;

      case AuditType.LOGIN_PROVIDER:
        // this.logSrv.info(`user data: ${JSON.stringify(user)}`)
        const provider: string = ( user?.providerData ) ?
          user.providerData[0]?.providerId : '';
        name = `Acceso con ${provider ?? ''} en ${timestamp}`;
        imageId = AuditItem.IMAGE_DELETED;
        imagePath = AuditItem.IMAGE_LOGIN;
        break;

      case AuditType.LOGIN_EMAIL:
        name = `Acceso con email en ${timestamp}`;
        imageId = AuditItem.IMAGE_LOGIN;
        imagePath = AuditItem.IMAGE_LOGIN;
        break;

      case AuditType.LOGOUT:
        name = `Cerró sesión en ${timestamp}`;
        imageId = AuditItem.IMAGE_LOGOUT;
        imagePath = AuditItem.IMAGE_LOGOUT;
        break;

      default:
        break;
    }

    return new AuditItem(
      '0',
      true,
      name,
      imageId, imagePath,
      BaseType.AUDIT,
      auditType,
      descExtra ?? null,
      user.uid,
      timestamp,
    );
  }
}
