/* eslint-disable @typescript-eslint/member-ordering */
import { IPlace } from '@models/place';
import { AuditType } from '@models/audit';

// eslint-disable-next-line no-shadow
export enum BaseType {
  DEFAULT = '',
  ENTITY = 'ENTITY',
  EVENT = 'EVENT',
  PLACE = 'PLACE',
  LINK = 'LINK',
  NEWS_ITEM = 'NEWS_ITEM',
  NOTICE = 'NOTICE',
  USER = 'USER',
  AUDIT = 'AUDIT',
  SOURCE = 'SOURCE',
}

export interface IBase {
  id: string;
  active: boolean;
  name: string;
  imageId: string;
  imagePath: string;
  baseType: BaseType;
  description?: string;
  timestamp?: string;
  place?: IPlace;
  order?: number;
  extra?: string; // With Schedule, date + time
  userId?: string;
  auditType?: AuditType;
  // getUrl(): string;
}

export class Base implements IBase {

  public static ID_DEFAULT = '0';
  public static NAME_DEFAULT = 'SIN ESPECIFICAR';
  public static IMAGE_DEFAULT = 'assets/images/imagen-no-disponible.png';

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public imageId: string,
    public imagePath: string,
    public baseType: BaseType,
    public description?: string,
    public timestamp?: string,
    public place?: IPlace,
    public order?: number,
    public extra?: string,
  ) { }

  getUrl(): string {
    switch(this.baseType) {
      case BaseType.ENTITY:
        return `entidades/${this.id}`;
      case BaseType.EVENT:
        return `eventos/${this.id}`;
      case BaseType.NOTICE:
        return `avisos/${this.id}`;
      default:
        return `todo`;
    }
  }

  static getUrl(base: IBase): string {
    switch(base.baseType) {
      case BaseType.ENTITY:
        return `entidades/${base.id}`;
      case BaseType.EVENT:
        return `eventos/${base.id}`;
      case BaseType.LINK:
        return `enlaces/${base.id}`;
      case BaseType.NOTICE:
          return `avisos/${base.id}`;
      default:
        return `todo`;
    }
  }

  static InitDefault(): Base {
    return new Base(
      Base.ID_DEFAULT,
      true,
      Base.NAME_DEFAULT,
      Base.IMAGE_DEFAULT, Base.IMAGE_DEFAULT,
      BaseType.DEFAULT,
      null,
      null,
      null,
      null,
    );
  }

  // Compara dos objetos en las listas mat-select
  public static compareSection(o1: IBase, o2: IBase): boolean {

    if ( !o1 || !o2 ) {
      return false;
    }

    if ( !(o1.name) || !(o2.name) ) {
      return o1.id === o2.id;
    }

    return o1.name === o2.name && o1.id === o2.id;
  }
}
