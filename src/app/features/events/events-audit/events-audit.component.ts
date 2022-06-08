import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { IEvent } from '@models/event';
import { IUser } from '@models/user';
import { Status } from '@models/status.enum';
import { EventService } from '@services/events.service';
import { SpinnerService } from '@services/spinner.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IBase } from '@models/base';

@Component({
  selector: 'app-events-audit',
  templateUrl: './events-audit.component.html',
  styleUrls: ['./events-audit.component.scss']
})
export class EventsAuditComponent implements OnInit, OnDestroy {

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
      'status', 'timestamp',
      'image', 'collapsed-info', 'name',
      'auditCreation', 'auditLastItem', 'nAuditItems'
];
  private listOfObservers: Array<Subscription> = [];
  private currentUser: IUser;

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private spinnerSvc: SpinnerService,
    private eventSrv: EventService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const subs1$ = this.eventSrv.getAllEventsWithAppointments(false, true, null)
                .pipe(
                  map(events => events.map(event => {

                    const auditCreation: IBase = event.auditItems[0];
                    event.auditCreation = auditCreation;

                    const nAuditItems: number = event.auditItems.length;

                    const auditLastItem: IBase = ( nAuditItems > 1 ) ? event.auditItems[nAuditItems - 1] : null;
                    event.auditLastItem = auditLastItem;

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

      this.listOfObservers.push(subs1$);
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

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

}
