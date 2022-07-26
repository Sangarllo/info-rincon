export interface IEventRef {
  id: string;
  name: string;
  dateStr: string;
  timeStr: string;
  eventId?: string;
}

export class EventRef implements IEventRef {

  constructor(
    public id: string,
    public name: string,
    public dateStr: string,
    public timeStr: string,
    public eventId?: string,
  ) { }
}

