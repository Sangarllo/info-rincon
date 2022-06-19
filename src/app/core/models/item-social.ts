import { BaseType } from '@models/base';

export interface IItemSocial {
  id: string;
  baseType: BaseType;
  usersFavs?: string[];
  nClaps?: number;
}

export class ItemSocial implements IItemSocial {

  constructor(
    public id: string,
    public baseType: BaseType,
    public usersFavs: string[],
    public nClaps: number,
  ) {
  }

  static InitDefault(itemId: string, baseType: BaseType): ItemSocial {
    return new ItemSocial( itemId, baseType, [], 0 );
  }
}
