import { IUser } from '@models/user';
import { BaseType, IBase } from '@models/base';

export enum AuditType {
  CREATED = 'CREATED',
  UPDATED_INFO = 'UPDATED_INFO',
  UPDATED_STATUS = 'UPDATED_STATUS',
  DELETED = 'DELETED',
}

export interface IAuditItem {
  id: string;
  active: boolean;
  name: string;
  image: string;
  baseType: BaseType;
  auditType: AuditType;
  desc: string;
}

export class AuditItem implements IAuditItem, IBase {

  public static IMAGE_DEFAULT = 'assets/images/audit/default.png';
  public static IMAGE_CREATED = 'assets/images/audit/created.png';
  public static IMAGE_UPDATED_INFO = 'assets/images/audit/updated-info.png';
  public static IMAGE_UPDATED_STATUS = 'assets/images/audit/updated-status.png';
  public static IMAGE_DELETED = 'assets/images/audit/deleted.png';

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public image: string,
    public baseType: BaseType,
    public auditType: AuditType,
    public desc: string,
     ) {
  }

  static InitDefault(auditType: AuditType, user: IUser, timeStamp: string, descEstra?: string): IAuditItem {

    let name = '';
    let image = AuditItem.IMAGE_DEFAULT;
    switch (auditType) {

      case AuditType.CREATED:
        name = `Creado en ${timeStamp}`;
        image = AuditItem.IMAGE_CREATED;
        break;

      case AuditType.UPDATED_STATUS:
        name = `Modificada la visualización en ${timeStamp}`;
        image = AuditItem.IMAGE_UPDATED_STATUS;
        break;

      case AuditType.UPDATED_INFO:
        name = `Modificada la información en ${timeStamp}`;
        image = AuditItem.IMAGE_UPDATED_INFO;
        break;

      case AuditType.DELETED:
        name = `Borrado en ${timeStamp}`;
        image = AuditItem.IMAGE_DELETED;
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
      ( descEstra ) ? `${user.displayName} (${descEstra})` : `${user.displayName}`
    );
  }
}
