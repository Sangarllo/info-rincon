export interface IEventComment {
  id: string;
  eventId: string;
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
    public userUid: string,
    public userName: string,
    public userImage: string,
    public message: string,
    public timestamp: string
  ) {
  }
}
