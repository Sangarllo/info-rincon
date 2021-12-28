import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

import { AdminGuard } from '@guards/admin.guard';
import { HomeComponent } from '@pages/home/home.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'calendario',
    loadChildren: () => import('./pages/calendar/calendar.module').then(m => m.CalendarEventsModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
    canActivate: [ AdminGuard ],
  },
  {
    path: 'entidades',
    loadChildren: () => import('./features/entities/entities.module').then(m => m.EntitiesModule),
  },
  {
    path: 'lugares',
    loadChildren: () => import('./features/places/places.module').then(m => m.PlacesModule),
  },
  {
    path: 'avisos',
    loadChildren: () => import('./features/notices/notices.module').then(m => m.NoticesModule),
  },
  {
    path: 'enlaces',
    loadChildren: () => import('./features/links/links.module').then(m => m.LinksModule),
  },
  {
    path: 'noticias',
    loadChildren: () => import('./features/news/news.module').then(m => m.NewsModule)
  },
  {
    path: 'imagenes',
    loadChildren: () => import('./features/pictures/pictures.module').then(m => m.PicturesModule),
    canActivate: [ AdminGuard ],
  },
  {
    path: 'evento',
    loadChildren: () => import('./features/event/event.module').then(m => m.EventModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'audit',
    loadChildren: () => import('./features/audit/audit.module').then(m => m.AuditModule),
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqModule)
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
