import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from '@app/admin/admin.component';
import { UserProfileComponent } from '@app/admin/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: ':perfil',
    component: UserProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
