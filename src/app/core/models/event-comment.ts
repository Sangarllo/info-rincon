export interface IEventComment {
  id: string;
  eventId: string;
  userId: string;
  text: string;
  timestamp: string;
}

export class EventComment implements IEventComment {

  constructor(
    public id: string,
    public eventId: string,
    public userId: string,
    public text: string,
    public timestamp: string
  ) {
  }
}
