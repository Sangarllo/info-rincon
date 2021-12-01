import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PicturesComponent } from '@features/pictures/pictures.component';

const routes: Routes = [
  {
    path: '',
    component: PicturesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PicturesRoutingModule { }
