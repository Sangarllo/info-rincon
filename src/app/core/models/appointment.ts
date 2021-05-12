export interface IAppointment {
  id: string;
  active: boolean;
  allDay: boolean;
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

  static computeDesc(appointment: IAppointment): string {
    try {
      if ( appointment.allDay ) {
        if ( appointment.withEnd && ( appointment.dateIni !== appointment.dateEnd )) {
          return `entre los días ${appointment.dateIni} y ${appointment.dateEnd}, ambos incluidos`;
        } else {
          return `durante el día ${appointment.dateIni}`;
        }
      } else {
        if ( appointment.withEnd ) {
          if ( appointment.dateIni === appointment.dateEnd ) {
            if ( appointment.timeIni === appointment.timeEnd ) {
              return `el día ${appointment.dateIni} a las ${appointment.timeIni}`;
            } else {
              return `el día ${appointment.dateIni}, de las ${appointment.timeIni} a las ${appointment.timeEnd}`;
            }
          } else {
            // eslint-disable-next-line max-len
            return `desde el día ${appointment.dateIni} a las ${appointment.timeIni}, al día ${appointment.dateEnd} a las ${appointment.timeEnd}`;
          }
        } else {
          return `el día ${appointment.dateIni} a las ${appointment.timeIni}`;
        }
      }
    }
    catch (exception) {
      return '# no se ha podido calcular #';
    }
  }
}
