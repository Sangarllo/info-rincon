import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { NoticesComponent } from '@features/notices/notices.component';
import { NoticeViewComponent } from '@features/notices/notice-view/notice-view.component';
import { NoticeEditComponent } from '@features/notices/notice-edit/notice-edit.component';
import { NoticesDashboardComponent } from '@features/notices/notices-dashboard/notices-dashboard.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    component: NoticesComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'dashboard',
    component: NoticesDashboardComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: ':id',
    component: NoticeViewComponent,
  },
  {
    path: ':id/editar',
    component: NoticeEditComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticesRoutingModule { }
