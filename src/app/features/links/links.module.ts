import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '@shared/shared.module';

import { LinksRoutingModule } from '@features/links/links-routing.module';
import { LinksComponent } from '@features/links/links.component';
import { LinksItemComponent } from '@features/links/links-item/links-item.component';
import { LinkViewComponent } from '@features/links/link-view/link-view.component';
import { LinkEditComponent } from '@features/links/link-edit/link-edit.component';
import { LinksDashboardComponent } from '@features/links/links-dashboard/links-dashboard.component';
import { LinkItemDialogComponent } from '@features/links/link-item-dialog/link-item-dialog.component';

@NgModule({
  declarations: [
    LinksComponent,
    LinkViewComponent,
    LinkEditComponent,
    LinkItemDialogComponent,
    LinksItemComponent,
    LinksDashboardComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    LinksRoutingModule,
  ],
  exports: [
    LinkItemDialogComponent,
    LinksDashboardComponent,
  ]
})
export class LinksModule { }
