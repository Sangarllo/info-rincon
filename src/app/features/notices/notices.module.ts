import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { NoticesRoutingModule } from '@features/notices/notices-routing.module';
import { NoticesComponent } from '@features/notices/notices.component';
import { NoticeViewComponent } from '@features/notices/notice-view/notice-view.component';
import { NoticeEditComponent } from '@features/notices/notice-edit/notice-edit.component';
import { NoticesDashboardComponent } from '@features/notices/notices-dashboard/notices-dashboard.component';

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
