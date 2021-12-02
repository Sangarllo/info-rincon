import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { PicturesRoutingModule } from '@features/pictures/pictures-routing.module';
import { PicturesComponent } from '@features/pictures/pictures.component';
import { PictureInfoDialogComponent } from '@features/pictures/picture-info-dialog/picture-info-dialog.component';

@NgModule({
  declarations: [
    PicturesComponent,
    PictureInfoDialogComponent
  ],
  imports: [
    SharedModule,
    PicturesRoutingModule
  ]
})
export class PicturesModule { }
