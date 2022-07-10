import { BaseType } from '@models/base';

export interface ISupportedItem {
  id: string;
  baseType: BaseType;
  timestamp?: string;
}

export class SupportedItem implements ISupportedItem {

  constructor(
    public id: string,
    public baseType: BaseType,
    public timestamp?: string,
  ) {
  }

  static InitDefault(itemId: string, baseType: BaseType): ISupportedItem {
    return new SupportedItem( itemId, baseType );
  }
}
