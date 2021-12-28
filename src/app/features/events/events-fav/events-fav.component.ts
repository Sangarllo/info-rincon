import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { AuthService } from '@auth/auth.service';
import { IEvent } from '@models/event';
import { IUser } from '@models/user';
import { UserService } from '@services/users.service';
import { LogService } from '@services/log.service';
import { EventService } from '@services/events.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-events-fav',
  templateUrl: './events-fav.component.html',
  styleUrls: ['./events-fav.component.css']
})
export class EventsFavComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public events: IEvent[] = [];
  public dataSource: MatTableDataSource<IEvent> = new MatTableDataSource();
  public displayedColumns: string[] = [ 'status', 'id', 'timestamp', 'image', 'collapsed-info', 'name', 'categories', 'actions1'];
  private currentUser: IUser;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private router: Router,
    public auth: AngularFireAuth,
    private authSrv: AuthService,
    private userSrv: UserService,
    private logSrv: LogService,
    private spinnerSvc: SpinnerService,
    private eventSrv: EventService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const subs1$ = this.auth.user.subscribe((usr) => {
      const uidUser = usr.uid;
      this.userSrv.getOneUser(uidUser)
      .subscribe( (user: IUser) => {
        this.currentUser = user;
        const favEvents = this.currentUser.favEvents;
        this.events = [];

        if ( favEvents?.length > 0 ) {
          this.eventSrv.getSeveralEvent(favEvents)
            .pipe(
              map(events => events.map(event => {
                const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

                event.description = ( event.categories ) ? event.categories.reduce(reducer, '') : '';
                return { ...event };
              }))
            )
            .subscribe((events: IEvent[]) => {
              this.events = events;
              this.dataSource = new MatTableDataSource(this.events);
              this.spinnerSvc.hide();
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
        } else {
          this.dataSource = new MatTableDataSource(this.events);
          this.spinnerSvc.hide();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    });

    // this.listOfObservers.push(subs1$); TODO Remove
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

  public removeFav(event: IEvent): void {
    this.currentUser.favEvents = this.currentUser.favEvents.filter( (eventId: string) => eventId !== event.id );
    this.userSrv.updateUser(this.currentUser);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
