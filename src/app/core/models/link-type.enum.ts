// eslint-disable-next-line no-shadow
export enum LinkType {
  UrlExterna = 'URL EXTERNA',
  Imagen = 'IMAGEN',
}

const LINK_TYPE_DEFAULT = LinkType.UrlExterna;
const LINK_TYPES: LinkType[] = [
  LinkType.UrlExterna,
  LinkType.Imagen,
];

export { LINK_TYPES, LINK_TYPE_DEFAULT };
