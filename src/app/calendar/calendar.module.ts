import { NgModule } from '@angular/core';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SharedModule } from '@shared/shared.module';

import { CalendarRoutingModule } from '@app/calendar/calendar-routing.module';
import { CalendarComponent } from '@app/calendar/calendar.component';
import { CalendarHeaderComponent } from '@app/calendar/calendar-header.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarHeaderComponent,
  ],
  imports: [
    SharedModule,
    CalendarRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  exports: [
    CalendarComponent
  ]
})
export class CalendarEventsModule { }
