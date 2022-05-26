import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntitiesRoutingModule } from '@features/entities/entities-routing.module';
import { EntitiesComponent } from '@features/entities/entities.component';
import { EntityCardComponent } from '@features/entities/entity-card/entity-card.component';
import { EntityViewComponent } from '@features/entities/entity-view/entity-view.component';
import { EntityEditComponent } from '@features/entities/entity-edit/entity-edit.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    EntitiesComponent,
    EntityCardComponent,
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
