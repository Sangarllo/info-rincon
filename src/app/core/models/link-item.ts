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

  description?: string;
  timestamp?: string;
  sourceUrl?: string;

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

    public description?: string,
    public timestamp?: string,
    public sourceUrl?: string,

    public sourceUid?: string,
    public sourceName?: string,
    public sourceType?: string,

  ) {
  }

  static InitDefault(item: IBase,
    linkItemType: LinkItemType,
    name: string, description: string, sourceUrl: string,
    sourceUid: string, sourceName: string, sourceType: string ): LinkItem {
    return new LinkItem(
      '0', true, name,
      item.imageId, item.imagePath,
      BaseType.LINK, linkItemType, // BaseType, LinkItemType,
      item.id, item.name, item.baseType, // itemId, itemType
      description, null, sourceUrl, // desc, Timestamp, sourceUrl,
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
      case 'Web':
          return LinkItemType.Web;
      case 'Fotos':
          return LinkItemType.Fotos;
      case 'Video':
          return LinkItemType.Video;
      case 'Noticia':
          return LinkItemType.Noticia;
      case 'Reportaje':
          return LinkItemType.Reportaje;
      case 'Resultados':
          return LinkItemType.Resultados;
      case 'Mapa':
          return LinkItemType.Mapa;
      default:
            return LINK_ITEM_TYPE_DEFAULT;
    }
  }
}
