import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from '@pages/admin/admin-routing.module';
import { AdminComponent } from '@pages/admin/admin.component';

@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
