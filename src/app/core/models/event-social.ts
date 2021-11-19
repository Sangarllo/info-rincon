export interface IEventSocial {
  id: string;
  usersFavs?: string[];
  nClaps?: number;
}

export class EventSocial implements IEventSocial {

  constructor(
    public id: string,
    public usersFavs: string[],
    public nClaps: number,
  ) {
  }

  static InitDefault(eventId: string): EventSocial {
    return new EventSocial( eventId, [], 0 );
  }
}
