import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { DashboardRoutingModule } from '@pages/dashboard/dashboard-routing.module';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { CalendarEventsModule } from '@pages/calendar/calendar.module';
import { NoticesModule } from '@features/notices/notices.module';
import { LinksModule } from '@features/links/links.module';

import { NoticeAlertedDialogComponent } from '@pages/dashboard/notice-alerted-dialog/notice-alerted-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NoticeAlertedDialogComponent,
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    CalendarEventsModule,
    NoticesModule,
    LinksModule,
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
