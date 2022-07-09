export enum LinkItemType {
  Imagen = '🖼️​',
  Web = '🌐​',
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
  LinkItemType.Fotos,
  LinkItemType.Video,
  LinkItemType.Noticia,
  LinkItemType.Reportaje,
  LinkItemType.Resultados,
  LinkItemType.Mapa
];

export { LINK_ITEM_TYPES, LINK_ITEM_TYPE_DEFAULT };

