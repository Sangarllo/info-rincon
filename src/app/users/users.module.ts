import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { UsersRoutingModule } from '@app/users/users-routing.module';
import { UsersComponent } from '@app/users/users.component';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
