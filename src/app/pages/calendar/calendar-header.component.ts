import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CalendarView } from 'angular-calendar';

import { EventsSearchDialogComponent } from '@features/events/events-search-dialog/events-search-dialog.component';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
})
export class CalendarHeaderComponent {

  @Input() view: CalendarView;
  @Input() viewDate: Date;
  @Input() locale = 'es';

  @Output() viewChange = new EventEmitter<CalendarView>();
  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;

  constructor(
    public dialog: MatDialog,
  ) {}

  gotoEventSearch() {
    const dialogRef = this.dialog.open(EventsSearchDialogComponent);
  }

}
