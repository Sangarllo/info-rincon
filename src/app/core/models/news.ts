import { IBase, BaseType } from 'src/app/core/models/base';
import { DEFAULT_SOURCE, ISource } from 'src/app/core/models/source';
import { Status, STATUS_MODES } from 'src/app/core/models/status.enum';
import { Category } from 'src/app/core/models/category.enum';

export interface INewsItem {
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

export class NewsItem implements INewsItem, IBase {

  public static IMAGE_DEFAULT = 'assets/images/news/default.png';
  public static PATH_URL = 'noticias';
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

  getUrl(): string {
    return `${NewsItem.PATH_URL}/${this.id}`;
  }

  static InitDefault(): NewsItem {
    return new NewsItem(
      '0', true, '', NewsItem.IMAGE_DEFAULT, BaseType.NEWS_ITEM, // Base
      Status.Visible,
      true,
      [],
      '',
      null, // Timestamp
      DEFAULT_SOURCE, null, // Source
    );
  }
}
