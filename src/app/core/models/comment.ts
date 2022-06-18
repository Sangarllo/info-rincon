export interface IComment {
  id: string;
  itemId: string;
  itemName: string;
  commentatorDisplayedName: string;
  commentatorDisplayedImage: string;
  userUid: string;
  userName: string;
  userImage: string;
  message: string;
  timestamp: string;
  commentType: CommentType;
}


export class Comment implements IComment {

  constructor(
    public id: string,
    public itemId: string,
    public itemName: string,
    public commentatorDisplayedName: string,
    public commentatorDisplayedImage: string,
    public userUid: string,
    public userName: string,
    public userImage: string,
    public message: string,
    public timestamp: string,
    public commentType: CommentType
  ) {
  }
}


// eslint-disable-next-line no-shadow
export enum CommentType {
  Event = 'EVENT',
  Notice = 'NOTICE',
}

const COMMENT_TYPES: CommentType[] = [
  CommentType.Event,
  CommentType.Notice,
];

export { COMMENT_TYPES };
