// eslint-disable-next-line no-shadow
export enum ScheduleType {
  Acto = 'ACTO',
  Actuación = 'ACTUACIÓN',
  Carrera = 'CARRERA',
  Ceremonia = 'CEREMONIA',
  Concierto = 'CONCIERTO',
  Festejo = 'FESTEJO',
  Misa = 'MISA',
  Partido = 'PARTIDO',
  Película = 'PELÍCULA',
  Proyección = 'PROYECCIÓN',
}

const SCHEDULE_TYPE_DEFAULT = ScheduleType.Acto;
const SCHEDULE_TYPES: ScheduleType[] = [
  ScheduleType.Acto,
  ScheduleType.Actuación,
  ScheduleType.Carrera,
  ScheduleType.Ceremonia,
  ScheduleType.Concierto,
  ScheduleType.Festejo,
  ScheduleType.Misa,
  ScheduleType.Partido,
  ScheduleType.Película,
  ScheduleType.Proyección,
];

export { SCHEDULE_TYPES, SCHEDULE_TYPE_DEFAULT };
