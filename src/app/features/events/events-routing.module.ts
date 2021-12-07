import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@pages/login/auth.guard';

import { EventsComponent } from '@features/events/events.component';
import { EventsFavComponent } from '@features/events/events-fav/events-fav.component';
import { EventsOwnComponent } from '@features/events/events-own/events-own.component';
import { EventViewComponent } from '@features/events/event-view/event-view.component';
import { EventConfigComponent } from '@features/events/event-config/event-config.component';
import { EventEditComponent } from '@features/events/event-edit/event-edit.component';
import { EventCreationComponent } from '@features/events/event-creation/event-creation.component';
import { EventWikiComponent } from '@features/events/event-wiki/event-wiki.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent
  },
  {
    path: 'new',
    component: EventCreationComponent,
  },
  {
    path: 'favoritos',
    component: EventsFavComponent
  },
  {
    path: 'propios',
    component: EventsOwnComponent
  },
  {
    path: ':id',
    component: EventViewComponent,
  },
  {
    path: ':id/editar',
    component: EventEditComponent,
  },
  {
    path: ':id/config',
    component: EventConfigComponent,
  },
  {
    path: ':id/wiki',
    component: EventWikiComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
