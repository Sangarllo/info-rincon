/* eslint-disable @typescript-eslint/member-ordering */
import { BaseType, IBase } from '@models/base';
import { LinkItemType, LINK_ITEM_TYPE_DEFAULT } from '@models/link-item-type.enum';

export interface ILinkItem {
  id: string;
  active: boolean;
  name: string;
  imageId: string;
  imagePath: string;

  baseType: BaseType;
  linkItemType: LinkItemType;

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
    public linkItemType: LinkItemType,

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
    linkItemType: LinkItemType,
    sourceUid: string, sourceName: string, sourceType: string ): LinkItem {
    return new LinkItem(
      '0', true, name,
      item.imageId, item.imagePath,
      BaseType.LINK, linkItemType, // BaseType, LinkItemType,
      item.id, item.name, item.baseType, // itemId, itemType
      null, // Timestamp
      sourceUid, sourceName, sourceType // Source
    );
  }

  getUrl(): string {
    return `${LinkItem.PATH_URL}/${this.id}`;
  }


  static getLinkItemType(key: string): LinkItemType {
    switch (key) {
      case 'Imagen':
          return LinkItemType.Imagen;
      case 'UrlExterna':
          return LinkItemType.UrlExterna;
      case 'GaleriaFotos':
          return LinkItemType.GaleriaFotos;
      case 'Video':
          return LinkItemType.Video;
      case 'Noticia':
          return LinkItemType.Noticia;
      case 'Resultados':
          return LinkItemType.Resultados;
      default:
            return LINK_ITEM_TYPE_DEFAULT;
    }
  }
}
