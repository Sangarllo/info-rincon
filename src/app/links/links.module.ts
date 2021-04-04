import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { LinksRoutingModule } from '@app/links/links-routing.module';
import { LinksComponent } from '@app/links/links.component';
import { LinkViewComponent } from '@app/links/link-view/link-view.component';
import { LinkEditComponent } from '@app/links/link-edit/link-edit.component';
import { LinksDashboardComponent } from '@app/links/links-dashboard/links-dashboard.component';


@NgModule({
  declarations: [
    LinksComponent,
    LinkViewComponent,
    LinkEditComponent,
    LinksDashboardComponent,
  ],
  imports: [
    SharedModule,
    LinksRoutingModule,
  ],
  exports: [
    LinksDashboardComponent,
  ]
})
export class LinksModule { }
