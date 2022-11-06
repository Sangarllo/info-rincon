export enum EventMode {
  SIMPLE = 'SIMPLE',
  SPLITTED = 'SPLITTED',
  SUPEREVENT = 'SUPEREVENT',
}

const EVENT_MODES: EventMode[] = [
  EventMode.SIMPLE,
  EventMode.SPLITTED,
  EventMode.SUPEREVENT,
];

const EVENT_MODE_DEFAULT = EventMode.SIMPLE;

export { EVENT_MODES, EVENT_MODE_DEFAULT };
