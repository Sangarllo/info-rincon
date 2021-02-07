import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { HomeRoutingModule } from '@app/home/home-routing.module';
import { HomeComponent } from '@app/home/home.component';
import { CalendarEventsModule } from '@app/calendar/calendar.module';
import { NoticesModule } from '@app/notices/notices.module';
import { NewsModule } from '@app/news/news.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    HomeRoutingModule,
    SharedModule,
    CalendarEventsModule,
    NoticesModule,
    NewsModule,
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
