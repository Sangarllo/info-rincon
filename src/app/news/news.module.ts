import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { NewsRoutingModule } from '@app/news/news-routing.module';
import { NewsComponent } from '@app/news/news.component';
import { NewsViewComponent } from '@app/news/news-view/news-view.component';
import { NewsEditComponent } from '@app/news/news-edit/news-edit.component';
import { NewsDashboardComponent } from '@app/news/news-dashboard/news-dashboard.component';


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
