import { IBase, BaseType } from '@models/base';
import { Status, STATUS_MODES } from '@models/status.enum';
import { Category } from '@models/category.enum';

export interface INotice {
  id: string;
  active: boolean;
  name: string;
  imageId: string;
  imagePath: string;
  thumbnailImg: string;
  baseType: BaseType;
  status: Status;
  focused: boolean;
  alerted: boolean;
  categories?: Category[];
  description?: string;
  timestamp?: string;
  extra?: string;
}

export class Notice implements INotice, IBase {

  public static IMAGE_DEFAULT = 'assets/images/notices/default.png';
  public static PATH_URL = 'avisos';
  public static STATUS: Status[] = STATUS_MODES;

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public imageId: string,
    public imagePath: string,
    public thumbnailImg: string,
    public baseType: BaseType,
    public status: Status,
    public focused: boolean,
    public alerted: boolean,
    public categories?: Category[],
    public description?: string,
    public timestamp?: string,
    public extra?: string,
  ) {
  }

  static InitDefault(): Notice {
    return new Notice(
      '0', true, '',
      Notice.IMAGE_DEFAULT, Notice.IMAGE_DEFAULT, Notice.IMAGE_DEFAULT, // Images
      BaseType.NOTICE, // Base
      Status.Visible,
      true,
      false,
      [Category.Aviso],
      '',
      null, // Timestamp
      '', // Extra
    );
  }

  getUrl(): string {
    return `${Notice.PATH_URL}/${this.id}`;
  }
}
