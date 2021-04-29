import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@features/users/auth.guard';
import { LoginPageComponent } from '@features/users/login-page/login-page.component';
import { UsersComponent } from '@features/users/users.component';
import { UserViewComponent } from '@features/users/user-view/user-view.component';
import { UserEditComponent } from '@features/users/user-edit/user-edit.component';
import { UserAdminEntitiesComponent } from '@features/users/user-admin-entities/user-admin-entities.component';
import { UserAuditComponent } from '@features/users/user-audit/user-audit.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: ':uid',
    component: UserViewComponent,
  },
  {
    path: ':uid/editar',
    component: UserEditComponent,
  },
  {
    path: ':uid/entidades',
    component: UserAdminEntitiesComponent
  },
  {
    path: ':uid/audit',
    component: UserAuditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
