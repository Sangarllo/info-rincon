import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

import { AdminGuard } from '@guards/admin.guard';
import { EventResolver } from '@resolvers/event.resolver';

import { EventsComponent } from '@features/events/events.component';
import { EventsFavComponent } from '@features/events/events-fav/events-fav.component';
import { EventsAuditComponent } from '@features/events/events-audit/events-audit.component';
import { EventsAuditSocialComponent } from '@features/events/events-audit-social/events-audit-social.component';
import { EventsOwnComponent } from '@features/events/events-own/events-own.component';
import { EventViewComponent } from '@features/events/event-view/event-view.component';
import { EventConfigComponent } from '@features/events/event-config/event-config.component';
import { EventEditComponent } from '@features/events/event-edit/event-edit.component';
import { EventCreationComponent } from '@features/events/event-creation/event-creation.component';
import { EventWikiComponent } from '@features/events/event-wiki/event-wiki.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    canActivate: [ AdminGuard ],
  },
  {
    path: 'new',
    component: EventCreationComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'audit',
    component: EventsAuditComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'audit-social',
    component: EventsAuditSocialComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'favoritos',
    component: EventsFavComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'propios',
    component: EventsOwnComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: ':id',
    component: EventViewComponent,
    resolve: {
      event: EventResolver,
    }
  },
  {
    path: ':id/editar',
    component: EventEditComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: ':id/config',
    component: EventConfigComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: ':id/wiki',
    component: EventWikiComponent,
    canActivate: [ AdminGuard ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
