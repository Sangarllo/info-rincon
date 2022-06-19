/* eslint-disable max-len */
// eslint-disable-next-line no-shadow
import firebase from 'firebase/compat/app';

import { BaseType, IBase } from '@models/base';

export enum AuditSocialType {
  FAV_ON = 'FAV_ON',
  FAV_OFF = 'FAV_OFF',
  CLAP = 'CLAP',
  COMMENT = 'COMMENT',
}

export interface IAuditSocialItem {
  id: string;
  timestamp: string;
  active: boolean;
  name: string;
  imageId: string;
  imagePath: string;
  baseType: BaseType;
  auditSocialType: AuditSocialType;
  itemId: string;
  itemName: string;
  itemType: BaseType;
  userUid?: string;
  userDisplayName?: string;
  text?: string;
}

export class AuditSocialItem implements IAuditSocialItem, IBase {

  public static IMG_DEFAULT = 'assets/images/audit/default.png';
  public static IMG_COMMENTS = 'assets/svg/comments.svg';
  public static IMG_FAVORITE_ON = 'assets/svg/favorite-on.svg';
  public static IMG_FAVORITE_OFF = 'assets/svg/favorite-off.svg';
  public static IMG_CLAP_ON = 'assets/svg/clap-on.svg';
  public static IMG_CLAP_OFF = 'assets/svg/clap-off.svg';

  constructor(
    public id: string,
    public timestamp: string,
    public active: boolean,
    public name: string,
    public imageId: string,
    public imagePath: string,
    public baseType: BaseType,
    public auditSocialType: AuditSocialType,
    public itemId: string,
    public itemName: string,
    public itemType: BaseType,
    public userUid?: string,
    public userDisplayName?: string,
    public text?: string,
  ) {
  }

  static InitDefault(auditSocialType: AuditSocialType, timestamp: string, itemId: string, itemName, itemType: BaseType, userUid?: string, userName?: string, text?: string): IAuditSocialItem {

    let name = '';
    let imageId = AuditSocialItem.IMG_DEFAULT;
    let imagePath = AuditSocialItem.IMG_DEFAULT;
    switch (auditSocialType) {

      case AuditSocialType.FAV_ON:

        switch (itemType) {
          case BaseType.ENTITY:
            name = `Entidad favorita añadida | ${timestamp}`;
            break;
          case BaseType.EVENT:
            name = `Evento favorito añadido | ${timestamp}`;
            break;
        }
        imageId = AuditSocialItem.IMG_FAVORITE_ON;
        imagePath = AuditSocialItem.IMG_FAVORITE_ON;
        break;

      case AuditSocialType.FAV_OFF:

        switch (itemType) {
          case BaseType.ENTITY:
            name = `Entidad favorita eliminada | ${timestamp}`;
            break;
          case BaseType.EVENT:
            name = `Evento favorito eliminado | ${timestamp}`;
            break;
        }
        imageId = AuditSocialItem.IMG_FAVORITE_OFF;
        imagePath = AuditSocialItem.IMG_FAVORITE_OFF;
        break;

      case AuditSocialType.CLAP:
        name = `Aplauso | ${timestamp}`;
        imageId = AuditSocialItem.IMG_CLAP_ON;
        imagePath = AuditSocialItem.IMG_CLAP_ON;
        break;

      case AuditSocialType.COMMENT:
        name = `Comentario | ${timestamp}`;
        imageId = AuditSocialItem.IMG_COMMENTS;
        imagePath = AuditSocialItem.IMG_COMMENTS;
        break;

      default:
        break;
    }

    return new AuditSocialItem(
      '0',
      timestamp,
      true,
      name,
      imageId, imagePath,
      BaseType.AUDIT,
      auditSocialType,
      itemId, itemName, itemType,
      userUid, userName,
      text,
    );
  }
}
