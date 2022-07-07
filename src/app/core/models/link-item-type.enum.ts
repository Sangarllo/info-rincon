export enum LinkItemType {
  Imagen = '📷​',
  UrlExterna = '🌐​',
  GaleriaFotos = '🖼️​',
  Video = '📺',
  Noticia = '📰',
  Resultados = '🏁',
}


const LINK_ITEM_TYPE_DEFAULT = LinkItemType.UrlExterna;
const LINK_ITEM_TYPES: LinkItemType[] = [
  LinkItemType.Imagen,
  LinkItemType.UrlExterna,
  LinkItemType.GaleriaFotos,
  LinkItemType.Video,
  LinkItemType.Noticia,
  LinkItemType.Resultados
];

export { LINK_ITEM_TYPES, LINK_ITEM_TYPE_DEFAULT };

