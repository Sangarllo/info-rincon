import { NgModule } from '@angular/core';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SharedModule } from '@shared/shared.module';
import { HomeRoutingModule } from '@pages/home/home-routing.module';
import { HomeComponent } from '@pages/home/home.component';
// import { CalendarEventsModule } from '@pages/calendar/calendar.module';
import { NoticesModule } from '@features/notices/notices.module';
import { LinksModule } from '@features/links/links.module';
import { CalendarDayHeaderComponent } from './calendar-day-header/calendar-day-header.component';

@NgModule({
  declarations: [
    HomeComponent,
    CalendarDayHeaderComponent,
  ],
  imports: [
    HomeRoutingModule,
    SharedModule,
    NoticesModule,
    LinksModule,
    // CalendarEventsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
