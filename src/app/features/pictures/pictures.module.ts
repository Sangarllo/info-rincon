import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { PicturesRoutingModule } from './pictures-routing.module';
import { PicturesComponent } from '@features/pictures/pictures.component';



@NgModule({
  declarations: [
    PicturesComponent
  ],
  imports: [
    SharedModule,
    PicturesRoutingModule
  ]
})
export class PicturesModule { }
