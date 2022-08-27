export enum EventType {
  SIMPLE = 'SIMPLE',
  SPLITTED = 'SPLITTED',
  SUPEREVENT = 'SUPEREVENT',
}

const EVENT_TYPES: EventType[] = [
  EventType.SIMPLE,
  EventType.SPLITTED,
  EventType.SUPEREVENT,
];

const EVENT_TYPE_DEFAULT = EventType.SIMPLE;

export { EVENT_TYPES, EVENT_TYPE_DEFAULT };
