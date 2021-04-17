import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { Error404RoutingModule } from '@pages/error404/error404-routing.module';
import { Error404Component } from '@pages/error404/error404.component';


@NgModule({
  declarations: [Error404Component],
  imports: [
    SharedModule,
    Error404RoutingModule,
  ]
})
export class Error404Module { }
