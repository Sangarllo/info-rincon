import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { IAppointment, Appointment } from '@models/appointment';
import { IBase } from '@models/base';

const APPOINTMENTS_COLLECTION = 'appointments';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private appointmentCollection!: AngularFirestoreCollection<IAppointment>;
  private appointmentDoc!: AngularFirestoreDocument<IAppointment>;

  constructor(private afs: AngularFirestore) {
    this.appointmentCollection = afs.collection(APPOINTMENTS_COLLECTION);
  }

  getAllAppointments(): Observable<IAppointment[]> {
    return this.appointmentCollection.valueChanges();
  }

  getAppointmentsByRange( dateMin: string, dateMax: string ): Observable<IAppointment[]> {

    console.log(`getAppointmentsByRange( ${dateMin} - ${dateMax} )`);
    if ( dateMin === '' && dateMax === '' ) {
      this.appointmentCollection = this.afs.collection<IAppointment>(
        APPOINTMENTS_COLLECTION,
        ref => ref.where('active', '==', true)
      );

    } else {
      this.appointmentCollection = this.afs.collection<IAppointment>(
        APPOINTMENTS_COLLECTION,
        ref => ref.where('dateIni', '>=', dateMin)
                  .where('dateIni', '<=', dateMax)
                  .where('active', '==', true)
      );
    }

    return this.appointmentCollection.valueChanges();
  }


  getOneAppointment(idAppointment: string): Observable<IAppointment | undefined> {
    return this.appointmentCollection.doc(idAppointment).valueChanges({ idField: 'id' });
  }

  addAppointment(idAppointment: string): void {
    const newAppointment = Appointment.InitDefault(idAppointment);
    this.appointmentCollection.doc(idAppointment).set({
      id: idAppointment,
      active: newAppointment.active,
      allDay: newAppointment.allDay,
      dateIni: newAppointment.dateIni,
      timeIni: newAppointment.timeIni,
      withEnd: newAppointment.withEnd,
      dateEnd: newAppointment.dateEnd,
      timeEnd: newAppointment.timeEnd,
      description: newAppointment.description,
    });
  }

  addScheduleAppointment(scheduleItem: IBase, active: boolean): void {
    const idAppointment = scheduleItem.id;
    const dateTime = scheduleItem.extra.split(' ');
    this.appointmentCollection.doc(idAppointment).set({
      id: idAppointment,
      active,
      allDay: false,
      dateIni: dateTime[0],
      timeIni: dateTime[1],
      withEnd: false,
      dateEnd: '',
      timeEnd: '',
      description: '',
    });
  }

  enableAppointment(idAppointment: string, enable: boolean): void {
    this.appointmentDoc = this.afs.doc<IAppointment>(`${APPOINTMENTS_COLLECTION}/${idAppointment}`);
    console.log(`idAppointment: ${idAppointment}, enable: ${enable}`);

    this.appointmentDoc.update({ active: enable });
  }

  updateAppointment(appointment: IAppointment): void {
    const idAppointment = appointment.id;
    this.appointmentDoc = this.afs.doc<IAppointment>(`${APPOINTMENTS_COLLECTION}/${idAppointment}`);
    this.appointmentDoc.update(Object.assign({}, appointment));
  }

  deleteAppointment(idAppointment: string): void {
    this.appointmentDoc = this.afs.doc<IAppointment>(`${APPOINTMENTS_COLLECTION}/${idAppointment}`);
    this.appointmentDoc.delete();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();

    let month = '' + (date.getMonth() + 1);
    if (month.length < 2) {
      month = '0' + month;
    }

    let day = '' + date.getDate();
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  formatDateTime(date: Date, addYear?: number): string {

    const year = date.getFullYear() + (addYear ? addYear : 0);

    let month = '' + (date.getMonth() + 1);
    if (month.length < 2) {
      month = '0' + month;
    }

    let day = '' + date.getDate();
    if (day.length < 2) {
      day = '0' + day;
    }

    const dateStr = [year, month, day].join('-');

    let hour = '' + date.getHours();
    if (hour.length < 2) {
      hour = '0' + hour;
    }

    let min = '' + date.getMinutes();
    if (min.length < 2) {
      min = '0' + min;
    }

    let sec = '' + date.getSeconds();
    if (sec.length < 2) {
      sec = '0' + sec;
    }

    const timeStr = [hour, min, sec].join(':');

    return `${dateStr} ${timeStr}`;
  }

  public getTimestamp(addYear?: number): string {
    const today = new Date();
    return this.formatDateTime(today, addYear);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  from_YYYYMMDD_to_DDMMYYYY(date: string): string {
    const YYYY = date.substring(6, 4);
    const MM = date.substring(3,2);
    const DD = date.substring(0,2);

    return [DD, MM, YYYY].join('-');
  }
}
