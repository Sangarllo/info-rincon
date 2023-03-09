import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { CalendarView } from 'angular-calendar';

import { EventsSearchDialogComponent } from '@features/events/events-search-dialog/events-search-dialog.component';

@Component({
  selector: 'app-calendar-day-header',
  templateUrl: './calendar-day-header.component.html',
  styleUrls: ['./calendar-day-header.component.scss'],
})
export class CalendarDayHeaderComponent {

  @Input() view: CalendarView;
  @Input() viewDate: Date;
  @Input() locale = 'es';

  @Output() viewChange = new EventEmitter<CalendarView>();
  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) {}

  gotoCalendar() {
    this.router.navigate([`calendario`]);
  }

  gotoEventSearch() {
    console.log(`gotoEventSearch!`);

    const dialogRef = this.dialog.open(EventsSearchDialogComponent);

    // dialogRef.afterClosed().subscribe((eventDialog: IEvent) => {
    //   if ( eventDialog ) {
    //     this.event.name = eventDialog.name;
    //     this.event.description = eventDialog.description;
    //     this.event.categories = eventDialog.categories;
    //     this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO);
    //   } else {
    //     this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
    //   }
    // });

  }
}
