import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LinksComponent } from '@features/links/links.component';
import { LinkViewComponent } from '@features/links/link-view/link-view.component';
import { LinkEditComponent } from '@features/links/link-edit/link-edit.component';
import { LinksDashboardComponent } from '@features/links/links-dashboard/links-dashboard.component';

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
