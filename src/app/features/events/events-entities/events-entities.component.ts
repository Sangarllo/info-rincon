import { Component, ViewChild, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { IBase } from '@models/base';
import { IEvent } from '@models/event';
import { IUser } from '@models/user';
import { Status } from '@models/status.enum';
import { LogService } from '@services/log.service';
import { EventService } from '@services/events.service';
import { SpinnerService } from '@services/spinner.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '@services/users.service';
import { AuditType } from '@models/audit';

@Component({
  selector: 'app-events-entities',
  templateUrl: './events-entities.component.html',
})
export class EventsEntitiesComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public viewMode = 'list';
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
      'image', 'collapsed-info', 'name',
      'event-entities', // 'entity-main', // 'entities-info',
      // 'actions4'
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
                // .pipe(
                //   map(events => events.map(event => {
                //     // TODO is this needed?
                //     const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

                //     event.description = ( event.categories ) ? event.categories.reduce(reducer, '') : '';
                //     return { ...event };
                //   }))
                // )
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

  public setMain(eventEmmited: any): void {
    // console.log(`-> event: ${JSON.stringify(eventEmmited.event?.name)}`);
    // console.log(`-> base: ${JSON.stringify(eventEmmited.base)}`);
    // console.log(`-> main: ${JSON.stringify(eventEmmited.main)}`);

    if ( eventEmmited.main ) {
      const event: IEvent = eventEmmited.event;
      event.entityMain = eventEmmited.base;

      this.eventSrv.updateEvent(
          event,
          AuditType.UPDATED_INFO,
          'Nueva entidad principal'
      );
    }

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

}
