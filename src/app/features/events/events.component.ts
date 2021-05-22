import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { AuthService } from '@auth/auth.service';
import { IEvent } from '@models/event';
import { IUser } from '@models/user';
import { LogService } from '@services/log.service';
import { EventService } from '@services/events.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  private listOfObservers: Array<Subscription> = [];
  public events: IEvent[];
  public dataSource: MatTableDataSource<IEvent> = new MatTableDataSource();
  displayedColumns: string[] = [ 'status', 'id', 'timestamp', 'image', 'collapsed-info', 'name', 'categories', 'dateIni', 'actions3'];
  private currentUser: IUser;

  constructor(
    private router: Router,
    private authSrv: AuthService,
    private logSrv: LogService,
    private spinnerSvc: SpinnerService,
    private eventSrv: EventService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const subs1$ = this.authSrv.currentUser$
        .subscribe( (currentUser: IUser) => {
            this.currentUser = currentUser;
        });
    this.listOfObservers.push(subs1$);

    const subs2$ = this.eventSrv.getAllEventsWithAppointments()
        .pipe(
          map(events => events.map(event => {
            const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

            event.description = ( event.categories ) ? event.categories.reduce(reducer, '') : '';
            return { ...event };
          }))
        )
        .subscribe( (events: IEvent[]) => {
        this.events = events;
        this.dataSource = new MatTableDataSource(this.events);
        this.spinnerSvc.hide();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
    this.listOfObservers.push(subs2$);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public gotoItem(event: IEvent): void {
    this.router.navigate([`eventos/${event.id}`]);
  }

  public gotoItemAdmin(event: IEvent): void {
    this.router.navigate([`eventos/${event.id}/admin`]);
  }

  public deleteItem(event: IEvent): void {
    this.logSrv.info(`deleting ${event.id}`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción de borrado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventSrv.deleteEvent(event, this.currentUser);
        Swal.fire(
          '¡Borrado!',
          `${event.name} ha sido borrado`,
          'success'
        );
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`eventos/0/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
