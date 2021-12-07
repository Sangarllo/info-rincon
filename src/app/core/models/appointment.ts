import { IBase } from '@models/base';

export interface IAppointment {
  id: string;
  active: boolean;
  allDay: boolean;
  isSlice: boolean;
  dateIni: string;
  timeIni?: string;
  withEnd?: boolean;
  dateEnd?: string;
  timeEnd?: string;
  description?: string;
}

export class Appointment implements IAppointment {

  public static IMAGE_DEFAULT = 'assets/images/appointments/default.png';
  public static HOUR_DEFAULT = '00:00';
  public static PATH_URL = 'fechas';

  constructor(
    public id: string,
    public active: boolean,
    public allDay: boolean,
    public isSlice: boolean,
    public dateIni: string,
    public timeIni?: string,
    public withEnd?: boolean,
    public dateEnd?: string,
    public timeEnd?: string,
    public description?: string
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
      todayStr,
      Appointment.HOUR_DEFAULT,
      false,
      todayStr,
      Appointment.HOUR_DEFAULT,
      ''
    );

    basicAppointment.description = Appointment.computeDesc(basicAppointment);

    return basicAppointment;
  }

  static InitFromSchedule(scheduleItem: IBase, enable: boolean): Appointment {
    const dateTime = scheduleItem.extra.split(' ');

    const scheduleAppointment = new Appointment(
      scheduleItem.id,
      enable,
      false,
      true, // <- isSlice
      dateTime[0],
      dateTime[1],
      false,
      dateTime[0],
      Appointment.HOUR_DEFAULT,
      ''
    );

    return scheduleAppointment;
  }

  static computeDesc(appointment: IAppointment): string {
    try {

      const DMYdateIni = this.from_YYYYMMDD_to_DDMMYYYY(appointment.dateIni);
      console.log(`${appointment.dateIni} -> ${DMYdateIni}`);
      const DMYdateEnd = this.from_YYYYMMDD_to_DDMMYYYY(appointment.dateEnd);
      console.log(`${appointment.dateEnd} -> ${DMYdateEnd}`);

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


  // eslint-disable-next-line @typescript-eslint/naming-convention
  static from_YYYYMMDD_to_DDMMYYYY(date: string): string {
    const YYYY = date.substr(0, 4);
    const MM = date.substr(5,2);
    const DD = date.substr(8,2);

    return [DD, MM, YYYY].join('-');
  }
}
