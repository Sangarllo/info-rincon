import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '@shared/shared.module';

import { NoticesRoutingModule } from '@features/notices/notices-routing.module';
import { NoticesComponent } from '@features/notices/notices.component';
import { NoticeCardComponent } from '@features/notices/notice-card/notice-card.component';
import { NoticeViewComponent } from '@features/notices/notice-view/notice-view.component';
import { NoticeEditComponent } from '@features/notices/notice-edit/notice-edit.component';
import { NoticesDashboardComponent } from '@features/notices/notices-dashboard/notices-dashboard.component';
import { NoticeItemDetailComponent } from '@features/notices/notice-item-detail/notice-item-detail.component';
import { NoticeExpansionPanelComponent } from '@features/notices/notice-expansion-panel/notice-expansion-panel.component';


@NgModule({
  declarations: [
    NoticesComponent,
    NoticeCardComponent,
    NoticeViewComponent,
    NoticeEditComponent,
    NoticesDashboardComponent,
    NoticeExpansionPanelComponent,
    NoticeItemDetailComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    NoticesRoutingModule
  ],
  exports: [
    NoticesDashboardComponent,
    NoticeExpansionPanelComponent
  ]
})
export class NoticesModule { }
