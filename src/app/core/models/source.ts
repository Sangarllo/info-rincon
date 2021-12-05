import { IBase, BaseType } from '@models/base';

export interface ISource extends IBase {
  id: string;
  active: boolean;
  name: string;
  imageId: string;
  imagePath: string;
  baseType: BaseType;
  description?: string;
}

const DEFAULT_SOURCE: ISource = {
  id: '00',
  active: true,
  name: 'Otros',
  imageId: 'assets/images/sources/default.png',
  imagePath: 'assets/images/sources/default.png',
  baseType: BaseType.SOURCE,
  description: '',
};

const NEWS_SOURCES: ISource[] = [
  {
    id: '00',
    active: true,
    name: 'Otros',
    imageId: 'assets/images/sources/default.png',
    imagePath: 'assets/images/sources/default.png',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '01',
    active: true,
    name: 'Ayuntamiento de Rincón de Soto',
    imageId: 'assets/images/sources/ayuntamiento-rincondesoto.jpg',
    imagePath: 'assets/images/sources/ayuntamiento-rincondesoto.jpg',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '02',
    active: true,
    name: '941',
    imageId: 'assets/images/sources/941.png',
    imagePath: 'assets/images/sources/941.png',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '03',
    active: true,
    name: 'TV Rioja',
    imageId: 'assets/images/sources/tvr.jpg',
    imagePath: 'assets/images/sources/tvr.jpg',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '04',
    active: true,
    name: 'Onda Cero',
    imageId: 'assets/images/sources/ondacero.png',
    imagePath: 'assets/images/sources/ondacero.png',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '05',
    active: true,
    name: 'Radio Rioja - Cadena SER',
    imageId: 'assets/images/sources/radio-rioja-ser.jpg',
    imagePath: 'assets/images/sources/radio-rioja-ser.jpg',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '06',
    active: true,
    name: 'Cadena COPE',
    imageId: 'assets/images/sources/cope.jpg',
    imagePath: 'assets/images/sources/cope.jpg',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '07',
    active: true,
    name: 'Gobierno de La Rioja',
    imageId: 'assets/images/sources/gobierno-rioja',
    imagePath: 'assets/images/sources/gobierno-rioja',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '08',
    active: true,
    name: 'Actalidad Rioja Baja',
    imageId: 'assets/images/sources/actualidad-rioja-baja.jpg',
    imagePath: 'assets/images/sources/actualidad-rioja-baja.jpg',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '09',
    active: true,
    name: 'Revista Reserva',
    imageId: 'assets/images/sources/revista-reserva.jpg',
    imagePath: 'assets/images/sources/revista-reserva.jpg',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '10',
    active: true,
    name: 'Medios Riojanos',
    imageId: 'assets/images/sources/mediosriojanos.png',
    imagePath: 'assets/images/sources/mediosriojanos.png',
    baseType: BaseType.SOURCE,
    description: '',
  },
  {
    id: '11',
    active: true,
    name: 'LaRioja.com',
    imageId: 'assets/images/sources/larioja-com.png',
    imagePath: 'assets/images/sources/larioja-com.png',
    baseType: BaseType.SOURCE,
    description: '',
  },
];

export { NEWS_SOURCES, DEFAULT_SOURCE };
