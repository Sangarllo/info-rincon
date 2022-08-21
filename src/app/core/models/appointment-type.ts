export enum AppointmentType {
  NOPE = 'NOPE',
  EVENT = 'EVENT',
  SCHEDULE = 'SCHEDULE',
  EVENT_DATE = 'EVENT_DATE',
  EVENT_DATETIME = 'EVENT_DATETIME',
  DEADLINE = 'DEADLINE',
  PROVISIONAL = 'PROVISIONAL',
}

export interface IAppointmentTypeIcon {
  type: AppointmentType;
  icon: string;
  explication: string;
}

const APPOINTMENT_TYPE_DEFAULT = AppointmentType.EVENT_DATE;
const APPOINTMENT_ICON_TYPES: IAppointmentTypeIcon[] = [
  // { type: AppointmentType.NOPE, icon: 'NOPE' },
  {
      type: AppointmentType.EVENT_DATE,
      icon: '​📅​',
      explication: 'Fecha de evento'
  },
  {
      type: AppointmentType.EVENT_DATETIME,
      icon: '​⏰',
      explication: 'Fecha y hora'
  },
  {
      type: AppointmentType.DEADLINE,
      icon: '​⏳​',
      explication: 'Fecha límite'
  },
  {
      type: AppointmentType.PROVISIONAL,
      icon: '❓​',
      explication: 'Fecha provisional'
  },
];

export { APPOINTMENT_ICON_TYPES, APPOINTMENT_TYPE_DEFAULT };
