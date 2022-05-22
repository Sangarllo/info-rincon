export interface IEventComment {
  id: string;
  eventId: string;
  commentatorDisplayedName: string;
  commentatorDisplayedImage: string;
  userUid: string;
  userName: string;
  userImage: string;
  message: string;
  timestamp: string;
}


export class EventComment implements IEventComment {

  constructor(
    public id: string,
    public eventId: string,
    public commentatorDisplayedName: string,
    public commentatorDisplayedImage: string,
    public userUid: string,
    public userName: string,
    public userImage: string,
    public message: string,
    public timestamp: string
  ) {
  }
}

export interface INoticeComment {
  id: string;
  noticeId: string;
  commentatorDisplayedName: string;
  commentatorDisplayedImage: string;
  userUid: string;
  userName: string;
  userImage: string;
  message: string;
  timestamp: string;
}

export class NoticeComment implements INoticeComment {

  constructor(
    public id: string,
    public noticeId: string,
    public commentatorDisplayedName: string,
    public commentatorDisplayedImage: string,
    public userUid: string,
    public userName: string,
    public userImage: string,
    public message: string,
    public timestamp: string
  ) {
  }
}


export interface IComment {
  id: string;
  itemId: string;
  commentatorDisplayedName: string;
  commentatorDisplayedImage: string;
  userUid: string;
  userName: string;
  userImage: string;
  message: string;
  timestamp: string;
}


export class Comment implements IComment {

  constructor(
    public id: string,
    public itemId: string,
    public commentatorDisplayedName: string,
    public commentatorDisplayedImage: string,
    public userUid: string,
    public userName: string,
    public userImage: string,
    public message: string,
    public timestamp: string
  ) {
  }
}
