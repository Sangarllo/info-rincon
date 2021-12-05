import { CalendarEvent } from 'angular-calendar';

import { IBase, BaseType } from '@models/base';
import { Status, STATUS_MODES } from '@models/status.enum';
import { Category } from '@models/category.enum';

import { ScheduleType, SCHEDULE_TYPE_DEFAULT } from '@models/shedule-type.enum';

export interface CalendarEventExtended extends CalendarEvent {
  active: boolean;
}
export interface IEvent {
  id: string;
  active: boolean;
  name: string;
  imageId: string;
  imagePath: string;
  images: string[];
  baseType: BaseType;
  status: Status;
  focused: boolean;
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
  linkItems?: IBase[];
  auditItems?: IBase[];
  userId?: string;
  extra?: string; // Extra field to pass info
  extra2?: string; // Extra field to pass info
}

export class Event implements IEvent, IBase { // IAudit

  public static IMAGE_DEFAULT = 'assets/images/events/default.png';
  public static PATH_URL = 'eventos';
  public static STATUS: Status[] = STATUS_MODES;

  constructor(
    public id: string,

    public active: boolean,
    public status: Status,
    public focused: boolean,

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
    public linkItems: IBase[],
    public auditItems: IBase[],
    public userId: string,
    public extra: string,
    public extra2: string,
  ) {
  }

  static InitDefault(): Event {
    return new Event(
      '0',
      true, Status.Editing, true, // Status
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
      [], // Links
      [],  // Audit
      null, // UserId,
      null, null, // Extra, Extra2
    );
  }

  getUrl(): string {
    return `${Event.PATH_URL}/${this.id}`;
  }
}
