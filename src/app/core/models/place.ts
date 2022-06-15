import { IBase, BaseType } from '@models/base';
import { PlaceType } from '@models/place-type.enum';
export interface IPlace {
  id: string;
  active: boolean;
  name: string;
  imageId: string;
  imagePath: string;
  baseType: BaseType;
  types?: PlaceType[];
  description?: string;
  locality?: string;
  roleDefault?: string;
  categories?: string[];
  extra?: string; // Extra field to pass info
}

export class Place implements IPlace, IBase {

  public static IMAGE_DEFAULT = 'assets/images/places/default.png';
  public static NAME_DEFAULT = 'SIN ESPECIFICAR';
  public static LOCALITY_DEFAULT = 'Rincón de Soto';
  public static PATH_URL = 'lugares';

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public imageId: string,
    public imagePath: string,
    public baseType: BaseType,
    public types?: PlaceType[],
    public description?: string,
    public locality?: string,
    public roleDefault?: string,
    public extra?: string,
     ) {
  }

  getUrl(): string {
    return `${Place.PATH_URL}/${this.id}`;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static InitDefault(): Place {
    return new Place(
      '0', true, Place.NAME_DEFAULT,
      Place.IMAGE_DEFAULT, Place.IMAGE_DEFAULT,
      BaseType.PLACE, // Base
      [],
      '',
      Place.LOCALITY_DEFAULT,
      'SE CELEBRA EN',
      '',
    );
  }
}
