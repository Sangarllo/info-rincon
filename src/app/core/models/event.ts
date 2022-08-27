import { CalendarEvent } from 'angular-calendar';

import { IBase, BaseType } from '@models/base';
import { Status, STATUS_MODES } from '@models/status.enum';
import { Category } from '@models/category.enum';
import { ScheduleType, SCHEDULE_TYPE_DEFAULT } from '@models/shedule-type.enum';
import { IEventRef } from '@models/event-ref';
import { EventType, EVENT_TYPES, EVENT_TYPE_DEFAULT } from '@models/event-type.enum';


export interface CalendarEventExtended extends CalendarEvent {
  active: boolean;
}
export interface IEvent {
  id: string;
  active: boolean;
  pristine: boolean;
  name: string;
  imageId: string;
  imagePath: string;
  images: string[];
  baseType: BaseType;
  status: Status;
  focused: boolean;
  fixed: boolean;
  eventType: EventType;
  sanitizedUrl?: string;
  categories?: Category[];
  description?: string;
  scheduleType?: ScheduleType;
  timestamp?: string;
  appointmentId?: string;
  shownAsAWhole?: boolean;
  scheduleItems?: IBase[];
  placeItems?: IBase[];
  entityItems?: IBase[];
  entitiesArray?: string[];
  eventsRef?: IEventRef[];
  auditItems?: IBase[];
  userId?: string;
  usersArray?: string[];
  extra?: string; // Extra field to pass info
  extra2?: string; // Extra field to pass info
  auditCreation?: IBase;
  auditLastItem?: IBase;
}

export class Event implements IEvent, IBase { // IAudit

  public static IMAGE_DEFAULT = 'assets/images/events/default.png';
  public static PATH_URL = 'eventos';
  public static STATUS: Status[] = STATUS_MODES;
  public static EVENT_TYPES: EventType[] = EVENT_TYPES;

  constructor(
    public id: string,

    public active: boolean,
    public pristine: boolean,
    public status: Status,
    public focused: boolean,
    public fixed: boolean,

    public eventType: EventType,
    public name: string,
    public imageId: string,
    public imagePath: string,
    public images: string[],
    public baseType: BaseType,
    public sanitizedUrl: string,
    public categories: Category[],
    public description: string,
    public scheduleType: ScheduleType,
    public timestamp: string,
    public appointmentId: string,
    public shownAsAWhole: boolean,
    public scheduleItems: IBase[],
    public placeItems: IBase[],
    public entityItems: IBase[],
    public entitiesArray: string[],
    public eventsRef: IEventRef[],
    public auditItems: IBase[],
    public userId: string,
    public usersArray: string[],
    public extra: string,
    public extra2: string,
  ) {
  }

  static InitDefault(): Event {
    return new Event(
      '0',
      true, true, Status.Editing, true, false, // Status
      EVENT_TYPE_DEFAULT,
      '', // Name
      Event.IMAGE_DEFAULT, Event.IMAGE_DEFAULT, [ Event.IMAGE_DEFAULT ], // Image
      BaseType.EVENT, // BaseType
      '', // SanitizedUrl
      [], // Categories
      '', // Basics,
      SCHEDULE_TYPE_DEFAULT, // ScheduleType
      null, // Timestamp
      null, true, [], // Appointment, HowIsShown, scheduleItems
      [], // Place
      [], [], // Entity
      [], // EventsRef
      [],  // Audit
      null, [], // UserId,
      null, null, // Extra, Extra2
    );
  }

  getUrl(): string {
    return `${Event.PATH_URL}/${this.id}`;
  }
}
