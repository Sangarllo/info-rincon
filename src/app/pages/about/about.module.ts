import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AboutRoutingModule } from '@app/pages/about/about-routing.module';
import { AboutComponent } from '@app/pages/about/about.component';


@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    AboutRoutingModule,
    SharedModule,
  ]
})
export class AboutModule { }
