import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntitiesRoutingModule } from '@app/entities/entities-routing.module';
import { EntitiesComponent } from '@app/entities/entities.component';
import { EntityViewComponent } from '@app/entities/entity-view/entity-view.component';
import { EntityEditComponent } from '@app/entities/entity-edit/entity-edit.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    EntitiesComponent,
    EntityViewComponent,
    EntityEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EntitiesRoutingModule
  ]
})
export class EntitiesModule { }
