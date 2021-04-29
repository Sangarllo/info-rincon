import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@features/users/auth.guard';
import { HomeComponent } from '@pages/home/home.component';

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
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'entidades',
    loadChildren: () => import('./features/entities/entities.module').then(m => m.EntitiesModule)
  },
  {
    path: 'lugares',
    loadChildren: () => import('./features/places/places.module').then(m => m.PlacesModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'avisos',
    loadChildren: () => import('./features/notices/notices.module').then(m => m.NoticesModule)
  },
  {
    path: 'enlaces',
    loadChildren: () => import('./features/links/links.module').then(m => m.LinksModule)
  },
  {
    path: 'noticias',
    loadChildren: () => import('./features/news/news.module').then(m => m.NewsModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule)
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
