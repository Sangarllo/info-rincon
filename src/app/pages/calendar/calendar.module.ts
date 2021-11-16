import { NgModule } from '@angular/core';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SharedModule } from '@shared/shared.module';
import { CalendarRoutingModule } from '@pages/calendar/calendar-routing.module';
import { CalendarComponent } from '@pages/calendar/calendar.component';
import { CalendarHeaderComponent } from '@pages/calendar/calendar-header.component';
import { CalendarModeDialogComponent } from '@pages/calendar/calendar-mode-dialog.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarHeaderComponent,
    CalendarModeDialogComponent
  ],
  imports: [
    SharedModule,
    CalendarRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  exports: [
    CalendarComponent,
    // CalendarHeaderComponent,
  ]
})
export class CalendarEventsModule { }
