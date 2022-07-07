import { BaseType, IBase } from '@models/base';

export interface ILinkItem {
  id: string;
  active: boolean;
  name: string;
  imageId: string;
  imagePath: string;
  baseType: BaseType;

  itemId: string;
  itemName: string;
  itemType: BaseType;

  timestamp?: string;

  sourceUid?: string;
  sourceName?: string;
  sourceType?: string;
}

export class LinkItem implements ILinkItem, IBase {

  public static IMAGE_DEFAULT = 'assets/images/links/default.png';
  public static PATH_URL = 'enlaces';

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public imageId: string,
    public imagePath: string,
    public baseType: BaseType,
    public itemId: string,
    public itemName: string,
    public itemType: BaseType,

    public timestamp?: string,

    public sourceUid?: string,
    public sourceName?: string,
    public sourceType?: string,

  ) {
  }

  static InitDefault(name: string, item: IBase,
    sourceUid: string, sourceName: string, sourceType: string ): LinkItem {
    return new LinkItem(
      '0', true, name,
      LinkItem.IMAGE_DEFAULT, LinkItem.IMAGE_DEFAULT,
      BaseType.LINK,
      item.id, item.name, item.baseType, // itemId, itemType
      null, // Timestamp
      sourceUid, sourceName, sourceType // Source
    );
  }

  getUrl(): string {
    return `${LinkItem.PATH_URL}/${this.id}`;
  }
}
