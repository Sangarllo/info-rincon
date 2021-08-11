import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@pages/login/auth.guard';

import { EventsComponent } from '@features/events/events.component';
import { EventsFavComponent } from '@features/events/events-fav/events-fav.component';
import { EventViewComponent } from '@features/events/event-view/event-view.component';
import { EventAdminComponent } from '@features/events/event-admin/event-admin.component';
import { EventEditComponent } from '@features/events/event-edit/event-edit.component';
import { EventCreationComponent } from '@features/events/event-creation/event-creation.component';

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
    path: ':id',
    component: EventViewComponent,
  },
  {
    path: ':id/editar',
    component: EventEditComponent,
  },
  {
    path: ':id/admin',
    component: EventAdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
