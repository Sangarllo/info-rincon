import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoticesComponent } from '@features/notices/notices.component';
import { NoticeViewComponent } from '@features/notices/notice-view/notice-view.component';
import { NoticeEditComponent } from '@features/notices/notice-edit/notice-edit.component';
import { NoticesDashboardComponent } from '@features/notices/notices-dashboard/notices-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: NoticesComponent
  },
  {
    path: 'dashboard',
    component: NoticesDashboardComponent,
  },
  {
    path: ':id',
    component: NoticeViewComponent,
  },
  {
    path: ':id/editar',
    component: NoticeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticesRoutingModule { }
