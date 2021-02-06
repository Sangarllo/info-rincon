import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { AdminRoutingModule } from '@app/admin/admin-routing.module';
import { AdminComponent } from '@app/admin/admin.component';
import { UserProfileComponent } from '@app/admin/user-profile/user-profile.component';
import { RoleOptionsComponent } from './role-options/role-options.component';

@NgModule({
  declarations: [
    AdminComponent,
    UserProfileComponent,
    RoleOptionsComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
