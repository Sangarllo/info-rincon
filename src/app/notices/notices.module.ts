import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { NoticesRoutingModule } from '@app/notices/notices-routing.module';
import { NoticesComponent } from '@app/notices/notices.component';
import { NoticeViewComponent } from '@app/notices/notice-view/notice-view.component';
import { NoticeEditComponent } from '@app/notices/notice-edit/notice-edit.component';
import { NoticesDashboardComponent } from '@app/notices/notices-dashboard/notices-dashboard.component';

@NgModule({
  declarations: [
    NoticesComponent,
    NoticeViewComponent,
    NoticeEditComponent,
    NoticesDashboardComponent,
  ],
  imports: [
    SharedModule,
    NoticesRoutingModule
  ],
  exports: [
    NoticesDashboardComponent,
  ]
})
export class NoticesModule { }
