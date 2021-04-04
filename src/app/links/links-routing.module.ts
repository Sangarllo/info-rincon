import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LinksComponent } from '@app/links/links.component';
import { LinkViewComponent } from '@app/links/link-view/link-view.component';
import { LinkEditComponent } from '@app/links/link-edit/link-edit.component';
import { LinksDashboardComponent } from '@app/links/links-dashboard/links-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LinksComponent
  },
  {
    path: 'dashboard',
    component: LinksDashboardComponent,
  },
  {
    path: ':id',
    component: LinkViewComponent,
  },
  {
    path: ':id/editar',
    component: LinkEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinksRoutingModule { }
