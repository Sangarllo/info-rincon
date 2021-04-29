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
  image: string;
  baseType: BaseType;
  desc?: string;
  timestamp?: string;
  url?: string;
}

export class Base implements IBase {

  public static ID_DEFAULT = '0';
  public static NAME_DEFAULT = 'SIN ESPECIFICAR';
  public static IMAGE_DEFAULT = 'https://firebasestorage.googleapis.com/v0/b/memento-185617.appspot.com/o/no-image-default.png?alt=media';

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public image: string,
    public baseType: BaseType,
    public desc?: string,
    public timestamp?: string,
  ) { }


  static InitDefault(): Base {
    return new Base(
      Base.ID_DEFAULT,
      true,
      Base.NAME_DEFAULT,
      Base.IMAGE_DEFAULT,
      BaseType.DEFAULT,
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
