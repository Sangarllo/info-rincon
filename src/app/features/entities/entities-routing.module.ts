import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard } from '@guards/admin.guard';

import { EntitiesComponent } from '@features/entities/entities.component';
import { EntityViewComponent } from '@features/entities/entity-view/entity-view.component';
import { EntityEditComponent } from '@features/entities/entity-edit/entity-edit.component';

const routes: Routes = [
  {
    path: '',
    component: EntitiesComponent,
    canActivate: [ AdminGuard ],
  },
  {
    path: ':id',
    component: EntityViewComponent
  },
  {
    path: ':id/editar',
    component: EntityEditComponent,
    canActivate: [ AdminGuard ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesRoutingModule { }
