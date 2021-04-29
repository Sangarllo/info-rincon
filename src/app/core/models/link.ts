import { IBase, BaseType } from 'src/app/core/models/base';
import { DEFAULT_SOURCE, ISource } from 'src/app/core/models/source';
import { Status, STATUS_MODES } from 'src/app/core/models/status.enum';
import { Category } from 'src/app/core/models/category.enum';

export interface ILink {
  id: string;
  active: boolean;
  name: string;
  image: string;
  baseType: BaseType;
  status: Status;
  focused: boolean;
  categories?: Category[];
  description?: string;
  timestamp?: string;
  source?: ISource;
  sourceUrl?: string;
}

export class Link implements ILink, IBase {

  public static IMAGE_DEFAULT = 'assets/images/links/default.png';
  public static PATH_URL = 'enlaces';
  public static STATUS: Status[] = STATUS_MODES;

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public image: string,
    public baseType: BaseType,
    public status: Status,
    public focused: boolean,
    public categories?: Category[],
    public description?: string,
    public timestamp?: string,
    public source?: ISource,
    public sourceUrl?: string,
     ) {
  }

  static InitDefault(): Link {
    return new Link(
      '0', true, '', Link.IMAGE_DEFAULT, BaseType.LINK, // Base
      Status.Visible,
      true,
      [],
      '',
      null, // Timestamp
      DEFAULT_SOURCE, null, // Source
    );
  }
}
