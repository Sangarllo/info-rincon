import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProfileRoutingModule } from '@pages/profile/profile-routing.module';
import { ProfileComponent } from '@pages/profile/profile.component';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    ProfileRoutingModule,
    SharedModule,
  ]
})
export class ProfileModule { }
