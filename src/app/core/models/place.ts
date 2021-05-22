import { IBase, BaseType } from '@models/base';
import { PlaceType } from '@models/place-type.enum';
export interface IPlace {
  id: string;
  active: boolean;
  name: string;
  image: string;
  baseType: BaseType;
  types?: PlaceType[];
  description?: string;
  locality?: string;
  roleDefault?: string;
}

export class Place implements IPlace, IBase {

  public static IMAGE_DEFAULT = 'assets/images/places/default.png';
  public static LOCALITY_DEFAULT = 'Rincón de Soto';
  public static PATH_URL = 'lugares';

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public image: string,
    public baseType: BaseType,
    public types?: PlaceType[],
    public description?: string,
    public locality?: string,
    public roleDefault?: string,
     ) {
  }

  getUrl(): string {
    return `${Place.PATH_URL}/${this.id}`;
  }

  static InitDefault(): Place {
    return new Place(
      '0', true, '', Place.IMAGE_DEFAULT, BaseType.PLACE, // Base
      [],
      null,
      Place.LOCALITY_DEFAULT,
      'SE CELEBRA EN',
    );
  }
}
