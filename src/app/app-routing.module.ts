import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/users/auth.guard';
import { HomeComponent } from '@app/home/home.component';

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
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'calendario',
    loadChildren: () => import('./pages/calendar/calendar.module').then(m => m.CalendarEventsModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
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
    path: 'enlaces',
    loadChildren: () => import('./links/links.module').then(m => m.LinksModule)
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
    path        : '**',
    pathMatch   : 'full',
    loadChildren: () => import('./pages/error404/error404.module').then(m => m.Error404Module)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
