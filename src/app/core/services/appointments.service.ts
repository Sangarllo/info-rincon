import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { IAppointment, Appointment } from '@models/appointment';

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
      desc: newAppointment.desc,
    });
  }

  updateAppointment(appointment: IAppointment): void {
    const idAppointment = appointment.id;
    this.appointmentDoc = this.afs.doc<IAppointment>(`${APPOINTMENTS_COLLECTION}/${idAppointment}`);
    this.appointmentDoc.update(appointment);
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

  formatDateTime(date: Date): string {
    const year = date.getFullYear();

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

  public getTimestamp(): string {
    var today = new Date();
    return this.formatDateTime(today);
  }
}
