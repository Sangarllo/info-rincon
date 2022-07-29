export enum LinkItemType {
  Imagen = '🖼️​',
  Web = '🌐​',
  Horario = '📋​',
  Fotos = '​📷',
  Video = '🎬​',
  Noticia = '📰',
  Reportaje = '📝​',
  Resultados = '🏁',
  Mapa = '🧭​',
}

const LINK_ITEM_TYPE_DEFAULT = LinkItemType.Web;
const LINK_ITEM_TYPES: LinkItemType[] = [
  LinkItemType.Imagen,
  LinkItemType.Web,
  LinkItemType.Horario,
  LinkItemType.Fotos,
  LinkItemType.Video,
  LinkItemType.Noticia,
  LinkItemType.Reportaje,
  LinkItemType.Resultados,
  LinkItemType.Mapa
];

export enum LinkType {
  INFO = 'INFO',
  REPORT = 'REPORT',
}

const LINK_TYPES: LinkType[] = [
  LinkType.INFO,
  LinkType.REPORT,
];



export { LINK_ITEM_TYPES, LINK_ITEM_TYPE_DEFAULT, LINK_TYPES };

