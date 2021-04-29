import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { LinksRoutingModule } from '@features/links/links-routing.module';
import { LinksComponent } from '@features/links/links.component';
import { LinkViewComponent } from '@features/links/link-view/link-view.component';
import { LinkEditComponent } from '@features/links/link-edit/link-edit.component';
import { LinksDashboardComponent } from '@features/links/links-dashboard/links-dashboard.component';

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
