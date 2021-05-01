import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { HomeRoutingModule } from '@pages/home/home-routing.module';
import { HomeComponent } from '@pages/home/home.component';
import { CalendarEventsModule } from '@pages/calendar/calendar.module';
import { NoticesModule } from '@features/notices/notices.module';
import { LinksModule } from '@features/links/links.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    HomeRoutingModule,
    SharedModule,
    CalendarEventsModule,
    NoticesModule,
    LinksModule,
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
