import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { HomeRoutingModule } from '@app/home/home-routing.module';
import { HomeComponent } from '@app/home/home.component';
import { CalendarEventsModule } from '@app/pages/calendar/calendar.module';
import { NoticesModule } from '@app/notices/notices.module';
import { LinksModule } from '@app/links/links.module';

import { NoticeAlertedDialogComponent } from '@app/home/notice-alerted-dialog/notice-alerted-dialog.component';

@NgModule({
  declarations: [
    HomeComponent,
    NoticeAlertedDialogComponent,
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
