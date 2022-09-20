export enum AppointmentType {
  // NOPE = 'NOPE',
  // EVENT = 'EVENT',
  // SCHEDULE = 'SCHEDULE',
  EVENT_DATE = 'EVENT_DATE',
  EVENT_DATETIME = 'EVENT_DATETIME',
  RANGE_DATES = 'RANGE_DATES',
  DEADLINE = 'DEADLINE',
  PROVISIONAL = 'PROVISIONAL',
}

export const COLORS: any = {
  DATE: {
    primary: '#003A59', // '#FFFFFF',
    secondary: '#DEEEEC', // '#FFFFFF',
  },
  DATETIME: {
    primary: '#3E8B82', // '#ff00ff', 460FF1
    secondary: '#b9dfdb', // '#ffb3ff' 460FF1
  },
  DEADLINE: {
    primary: '#8b0000',
    secondary: '#f08080'
  },
  PROVISIONAL: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  INDIGO: {
    primary: '#3f51b5',
    secondary: '#c6cceb'
  },
};


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
      explication: 'Fecha'
  },
  {
      type: AppointmentType.EVENT_DATETIME,
      icon: '​⏰',
      explication: 'Fecha<br/>y hora'
  },
  {
      type: AppointmentType.RANGE_DATES,
      icon: '​↔️',
      explication: 'Rango<br/>días'
  },
{
      type: AppointmentType.DEADLINE,
      icon: '​⏳​',
      explication: 'Fecha<br/>límite'
  },
  {
      type: AppointmentType.PROVISIONAL,
      icon: '❓​',
      explication: 'Provisional'
  },
];

export { APPOINTMENT_ICON_TYPES, APPOINTMENT_TYPE_DEFAULT };
