import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsComponent } from '@app/news/news.component';
import { NewsViewComponent } from '@app/news/news-view/news-view.component';
import { NewsEditComponent } from '@app/news/news-edit/news-edit.component';
import { NewsDashboardComponent } from '@app/news/news-dashboard/news-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: NewsComponent
  },
  {
    path: 'dashboard',
    component: NewsDashboardComponent,
  },
  {
    path: ':id',
    component: NewsViewComponent,
  },
  {
    path: ':id/editar',
    component: NewsEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
