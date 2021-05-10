import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { CalendarView } from 'angular-calendar';

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


  constructor(private router: Router) {}

  gotoCalendar() {
    this.router.navigate([`calendario`]);
  }
}
