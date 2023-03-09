import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IEvent } from '@models/event';
import { IUser } from '@models/user';
import { Status } from '@models/status.enum';
import { LogService } from '@services/log.service';
import { EventService } from '@services/events.service';
import { SpinnerService } from '@services/spinner.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '@services/users.service';

@Component({
  selector: 'app-events-own',
  templateUrl: './events-own.component.html',
  styleUrls: ['./events-own.component.scss']
})
export class EventsOwnComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public viewMode = 'cards';
  public statusFiltered = [
    Status.Visible,
    Status.Editing,
    Status.Blocked,
    Status.Deleted
  ];
  public events: IEvent[] = [];
  public EVENTS_BACKUP: IEvent[];
  public dataSource: MatTableDataSource<IEvent> = new MatTableDataSource();
  displayedColumns: string[] = [
      'status', 'timestamp', // 'id',
      'image', 'collapsed-info', 'name', 'categories', 'dateIni',
      'actions4', 'social'
  ];
  public userLogged: IUser;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private logSrv: LogService,
    private spinnerSvc: SpinnerService,
    private eventSrv: EventService,
    private userSrv: UserService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const subs1$ = this.auth.user
        .subscribe((usr) => {
            const uidUser = usr?.uid;

            const subs2$ = this.userSrv.getOneUser(uidUser)
                .subscribe( (user: IUser) => {
                    this.userLogged = user;
            });

            const subs3$ = this.eventSrv.getAllEventsWithAppointments(false, true, uidUser)
                .pipe(
                  map(events => events.map(event => {
                    const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

                    event.description = ( event.categories ) ? event.categories.reduce(reducer, '') : '';
                    event.extra = this.formatSocialInfo(event.extra);
                    return { ...event };
                  }))
                )
            .subscribe( (events: IEvent[]) => {
                this.events = events;
                this.EVENTS_BACKUP = this.events;
                this.dataSource = new MatTableDataSource(this.events);
                this.spinnerSvc.hide();

                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });

            this.listOfObservers.push(subs1$, subs2$, subs3$);
      });
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

  public gotoItemConfig(event: IEvent): void {
    this.router.navigate([`eventos/${event.id}/config`]);
  }

  public deleteEvent(event: IEvent): void {
    this.logSrv.info(`deleteEvent ${event.id}`);
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
        this.eventSrv.deleteEvent(event);
        Swal.fire({
          title: '¡Borrado!',
          text: `${event.name} ha sido borrado`,
          icon: 'success',
          confirmButtonColor: '#003A59',
        });
      }
    });
  }

  deleteForeverEvent(event: IEvent): void {
    this.logSrv.info(`deleteForeverEvent: ${JSON.stringify(event.id)}`);
    this.eventSrv.deleteForeverEvent(event);
  }

  public addItem(): void {
    this.router.navigate([`eventos/0/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }

  setStatusFiltered(filtered: Status[]): void {
    this.statusFiltered = filtered;
    console.log(`${this.statusFiltered}`);
    this.events = this.EVENTS_BACKUP.filter(notice =>
      this.statusFiltered.includes(notice.status)
    );
  }

  private formatSocialInfo(info: string): string {
    let [ nClaps, usersFavs ] = info.split('|');
    nClaps = ( nClaps === 'undefined' ) ? '0' : nClaps;
    usersFavs = ( usersFavs === 'undefined' ) ? '0' : usersFavs;
    return `${nClaps} 👏  ${usersFavs} ❤️`;
  }
}
