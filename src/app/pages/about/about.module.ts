import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AboutRoutingModule } from '@pages/about/about-routing.module';
import { AboutComponent } from '@pages/about/about.component';


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
