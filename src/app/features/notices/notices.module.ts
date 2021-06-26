import { NgModule } from '@angular/core';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import { SharedModule } from '@shared/shared.module';

import { NoticesRoutingModule } from '@features/notices/notices-routing.module';
import { NoticesComponent } from '@features/notices/notices.component';
import { NoticeViewComponent } from '@features/notices/notice-view/notice-view.component';
import { NoticeEditComponent } from '@features/notices/notice-edit/notice-edit.component';
import { NoticesDashboardComponent } from '@features/notices/notices-dashboard/notices-dashboard.component';
import { NoticeItemDetailComponent } from '@features/notices/notice-item-detail/notice-item-detail.component';
import { NoticeExpansionPanelComponent } from '@features/notices/notice-expansion-panel/notice-expansion-panel.component';

@NgModule({
  declarations: [
    NoticesComponent,
    NoticeViewComponent,
    NoticeEditComponent,
    NoticesDashboardComponent,
    NoticeExpansionPanelComponent,
    NoticeItemDetailComponent,
  ],
  imports: [
    SharedModule,
    NoticesRoutingModule,
    ShareButtonsModule,
    ShareIconsModule
  ],
  exports: [
    NoticesDashboardComponent,
    NoticeExpansionPanelComponent
  ]
})
export class NoticesModule { }
