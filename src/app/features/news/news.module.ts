import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { NewsRoutingModule } from '@features/news/news-routing.module';
import { NewsComponent } from '@features/news/news.component';
import { NewsViewComponent } from '@features/news/news-view/news-view.component';
import { NewsEditComponent } from '@features/news/news-edit/news-edit.component';
import { NewsDashboardComponent } from '@features/news/news-dashboard/news-dashboard.component';


@NgModule({
  declarations: [
    NewsComponent,
    NewsViewComponent,
    NewsEditComponent,
    NewsDashboardComponent,
  ],
  imports: [
    SharedModule,
    NewsRoutingModule,
  ],
  exports: [
    NewsDashboardComponent,
  ]
})
export class NewsModule { }
