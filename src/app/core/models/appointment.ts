import { IBase } from '@models/base';
import { ScheduleType } from '@models/shedule-type.enum';

// eslint-disable-next-line no-shadow
export enum ShowMode {
  NOPE = 'NOPE',
  SHOWED_AS_WHOLE = 'SHOWED_AS_WHOLE',
  SHOWED_AS_SLICE = 'SHOWED_AS_SLICE',
  OVERSHADOWED_BY_WHOLE = 'OVERSHADOWED_BY_WHOLE',
  OVERSHADOWED_BY_SLICE = 'OVERSHADOWED_BY_SLICE',
}

export interface IAppointment {
  id: string;
  active: boolean;
  allDay: boolean;
  isSlice: boolean;
  showMode: ShowMode;
  dateIni: string;
  timeIni?: string;
  withEnd?: boolean;
  dateEnd?: string;
  timeEnd?: string;
  description?: string;
  isDeadline?: boolean;
}

export class Appointment implements IAppointment {

  public static IMAGE_DEFAULT = 'assets/images/appointments/default.png';
  public static HOUR_DEFAULT = '00:00';
  public static PATH_URL = 'fechas';

  constructor(
    public id: string,
    public active: boolean,
    public allDay: boolean,
    public isSlice: boolean, // <-- TODO delete
    public showMode: ShowMode,
    public dateIni: string,
    public timeIni?: string,
    public withEnd?: boolean,
    public dateEnd?: string,
    public timeEnd?: string,
    public description?: string,
    public isDeadline?: boolean,
     ) {
  }

  static InitDefault(id: string): Appointment {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const todayStr = today.toISOString().substr(0, 10);
    const basicAppointment = new Appointment(
      id,
      true,
      true,
      false, // <- isSlice
      ShowMode.SHOWED_AS_WHOLE,
      todayStr,
      Appointment.HOUR_DEFAULT,
      false,
      todayStr,
      Appointment.HOUR_DEFAULT,
      '',
      false,
    );

    basicAppointment.description = Appointment.computeDesc(basicAppointment);

    return basicAppointment;
  }

  static InitFromSchedule(scheduleItem: IBase, enable: boolean): Appointment {
    const dateTime = scheduleItem.extra.split(' ');
    const isDeadline: boolean = ( scheduleItem.extra2 === ScheduleType.FechaLimite );

    console.log(`isDeadline: ${isDeadline}`);

    const scheduleAppointment = new Appointment(
      scheduleItem.id,
      enable,
      false,
      true, // <- isSlice
      ShowMode.SHOWED_AS_SLICE,
      dateTime[0],
      dateTime[1],
      false,
      dateTime[0],
      Appointment.HOUR_DEFAULT,
      '',
      isDeadline,
    );

    return scheduleAppointment;
  }

  static computeDesc(appointment: IAppointment): string {
    try {

      const DMYdateIni = this.from_YYYYMMDD_to_DDMMYYYY(appointment.dateIni);
      // console.log(`${appointment.dateIni} -> ${DMYdateIni}`);
      const DMYdateEnd = this.from_YYYYMMDD_to_DDMMYYYY(appointment.dateEnd);
      // console.log(`${appointment.dateEnd} -> ${DMYdateEnd}`);

      if ( appointment.allDay ) {
        if ( appointment.withEnd && ( appointment.dateIni !== appointment.dateEnd )) {
          return `entre los días ${DMYdateIni} y ${DMYdateEnd}, ambos incluidos`;
        } else {
          return `durante el día ${DMYdateIni}`;
        }
      } else {
        if ( appointment.withEnd ) {
          if ( appointment.dateIni === appointment.dateEnd ) {
            if ( appointment.timeIni === appointment.timeEnd ) {
              return `el día ${DMYdateIni} a las ${appointment.timeIni}`;
            } else {
              return `el día ${DMYdateIni}, de las ${appointment.timeIni} a las ${appointment.timeEnd}`;
            }
          } else {
            // eslint-disable-next-line max-len
            return `desde el día ${DMYdateIni} a las ${appointment.timeIni}, al día ${DMYdateEnd} a las ${appointment.timeEnd}`;
          }
        } else {
          return `el día ${DMYdateIni} a las ${appointment.timeIni}`;
        }
      }
    }
    catch (exception) {
      return '# no se ha podido calcular #';
    }
  }



  static computeSimpleDesc(appointmentDesc: string): string {
    try {
      const dateDesc = appointmentDesc.substring(0,10);
      const hourDesc = appointmentDesc.substring(11,16);

      const DMYdateIni = this.from_YYYYMMDD_to_DDMMYYYY(dateDesc);

      return `el día ${DMYdateIni} a las ${hourDesc}`;
    }
    catch (exception) {
      return '# no se ha podido calcular #';
    }
  }


  // eslint-disable-next-line @typescript-eslint/naming-convention
  static from_YYYYMMDD_to_DDMMYYYY(date: string): string {
    const YYYY = date.substr(0, 4);
    const MM = date.substr(5,2);
    const DD = date.substr(8,2);

    return [DD, MM, YYYY].join('-');
  }
}
