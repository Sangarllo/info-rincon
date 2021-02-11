import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/users/auth.guard';
import { HomeComponent } from '@app/home/home.component';
import { Error404Component } from '@shared/components/error404/error404.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    // loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'entidades',
    loadChildren: () => import('./entities/entities.module').then(m => m.EntitiesModule)
  },
  {
    path: 'lugares',
    loadChildren: () => import('./places/places.module').then(m => m.PlacesModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'avisos',
    loadChildren: () => import('./notices/notices.module').then(m => m.NoticesModule)
  },
  {
    path: 'noticias',
    loadChildren: () => import('./news/news.module').then(m => m.NewsModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarEventsModule)
  },
  {
    path        : '**',
    pathMatch   : 'full',
    component   : Error404Component
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
