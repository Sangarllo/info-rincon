import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

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

  public filterValid = false;
  public events: IEvent[];
  public dataSource: MatTableDataSource<IEvent> = new MatTableDataSource();
  displayedColumns: string[] = [ 'image', 'collapsed-info', 'name', 'categories' ];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public dialogRef: MatDialogRef<EventsSearchDialogComponent>,
    private router: Router,
    private spinnerSvc: SpinnerService,
    private eventSrv: EventService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const subs1$ =
      this.eventSrv.getAllEventsWithAppointments(true, false, null)
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
