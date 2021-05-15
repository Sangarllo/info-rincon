import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@shared/material/material.module';

import { ShellComponent } from '@shared/layout/shell/shell.component';
import { FooterComponent } from '@shared/layout/footer/footer.component';
import { SectionHeaderComponent } from '@shared/layout/section-header/section-header.component';
import { BaseItemsListComponent } from '@shared/components/base-items-list/base-items-list.component';
import { BaseItemListedComponent } from '@shared/components/base-item-listed/base-item-listed.component';
import { BaseItemsTableComponent } from '@shared/components/base-items-table/base-items-table.component';
import { BaseItemsAdminComponent } from '@shared/components/base-items-admin/base-items-admin.component';
import { BaseItemDialogComponent } from '@shared/components/base-item-dialog/base-item-dialog.component';
import { BaseItemDetailComponent } from '@shared/components/base-item-detail/base-item-detail.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { RoleOptionsComponent } from '@shared/components/role-options/role-options.component';
import { RoleDirective } from '@shared/directives/role.directive';

const components = [
  ShellComponent,
  FooterComponent,
  SectionHeaderComponent,
  BaseItemDetailComponent,
  BaseItemDialogComponent,
  BaseItemsListComponent,
  BaseItemListedComponent,
  BaseItemsTableComponent,
  BaseItemsAdminComponent,
  BaseItemDetailComponent,
  SpinnerComponent,
  RoleOptionsComponent,
];

const directives = [
  RoleDirective,
]

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
    ...directives,
  ],
  imports: [
    ...modules
  ],
  exports: [
    ...modules,
    ...components,
    ...directives,
  ]
})
export class SharedModule { }
