import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material/material.module';

import { ShellComponent } from '@shared/layout/shell/shell.component';
import { FooterComponent } from '@shared/layout/footer/footer.component';
import { SectionHeaderComponent } from '@shared/layout/section-header/section-header.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { BaseItemDetailComponent } from '@shared/components/base-item-detail/base-item-detail.component';
import { BaseItemsListComponent } from '@shared/components/base-items-list/base-items-list.component';
import { BaseItemsTableComponent } from '@shared/components/base-items-table/base-items-table.component';
import { BaseItemsAdminComponent } from '@shared/components/base-items-admin/base-items-admin.component';

const components = [
  ShellComponent,
  FooterComponent,
  SectionHeaderComponent,
  LoadingComponent,
  BaseItemDetailComponent,
  BaseItemsListComponent,
  BaseItemsTableComponent,
  BaseItemsAdminComponent,
];

const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MaterialModule,
  RouterModule,
];

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    ...modules
  ],
  exports: [
    ...modules,
    ...components,
  ]
})
export class SharedModule { }
