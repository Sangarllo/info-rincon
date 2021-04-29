import { IBase, BaseType } from 'src/app/core/models/base';

export interface ISource extends IBase {
  id: string;
  active: boolean;
  name: string;
  image: string;
  baseType: BaseType;
  desc?: string;
}

const DEFAULT_SOURCE: ISource = {
  id: '00',
  active: true,
  name: 'Otros',
  image: 'assets/images/sources/default.png',
  baseType: BaseType.SOURCE,
  desc: '',
};

const NEWS_SOURCES: ISource[] = [
  {
    id: '00',
    active: true,
    name: 'Otros',
    image: 'assets/images/sources/default.png',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '01',
    active: true,
    name: 'Ayuntamiento de Rincón de Soto',
    image: 'assets/images/sources/ayuntamiento-rincondesoto.jpg',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '02',
    active: true,
    name: '941',
    image: 'assets/images/sources/941.png',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '03',
    active: true,
    name: 'TV Rioja',
    image: 'assets/images/sources/tvr.jpg',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '04',
    active: true,
    name: 'Onda Cero',
    image: 'assets/images/sources/ondacero.png',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '05',
    active: true,
    name: 'Radio Rioja - Cadena SER',
    image: 'assets/images/sources/radio-rioja-ser.jpg',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '06',
    active: true,
    name: 'Cadena COPE',
    image: 'assets/images/sources/cope.jpg',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '07',
    active: true,
    name: 'Gobierno de La Rioja',
    image: 'assets/images/sources/gobierno-rioja',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '08',
    active: true,
    name: 'Actalidad Rioja Baja',
    image: 'assets/images/sources/actualidad-rioja-baja.jpg',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '09',
    active: true,
    name: 'Revista Reserva',
    image: 'assets/images/sources/revista-reserva.jpg',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '10',
    active: true,
    name: 'Medios Riojanos',
    image: 'assets/images/sources/mediosriojanos.png',
    baseType: BaseType.SOURCE,
    desc: '',
  },
  {
    id: '11',
    active: true,
    name: 'LaRioja.com',
    image: 'assets/images/sources/larioja-com.png',
    baseType: BaseType.SOURCE,
    desc: '',
  },
];

export { NEWS_SOURCES, DEFAULT_SOURCE };
