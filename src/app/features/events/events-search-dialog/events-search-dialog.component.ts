import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { IEvent } from '@models/event';
import { EventService } from '@services/events.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-events-search-dialog',
  templateUrl: './events-search-dialog.component.html',
  styleUrls: ['./events-search-dialog.component.scss']
})
export class EventsSearchDialogComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public filterValid: boolean = false;
  private listOfObservers: Array<Subscription> = [];
  public events: IEvent[];
  public dataSource: MatTableDataSource<IEvent> = new MatTableDataSource();
  displayedColumns: string[] = [ 'image', 'collapsed-info', 'name', 'categories' ];

  constructor(
    public dialogRef: MatDialogRef<EventsSearchDialogComponent>,
    private router: Router,
    private spinnerSvc: SpinnerService,
    private eventSrv: EventService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    //this.events$ = this.eventsSrv.getAllEvents(true, true, 2);

    const subs1$ = //this.eventSrv.getAllEvents(true, true, 2)
      this.eventSrv.getAllEventsWithAppointments()
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
    this.listOfObservers.push(subs1$);
  }

  applyFilter(filterValue: string): void {

    if ( filterValue.length >= 3 ) {
      this.filterValid = true;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.filterValid = false;
    }
  }

  public gotoItem(event: IEvent): void {
    // console.log(`gotoItem: ${JSON.stringify(event)}`);
    this.router.navigate([`eventos/${event.id}`]);
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
