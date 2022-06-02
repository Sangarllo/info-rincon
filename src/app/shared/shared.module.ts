import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@shared/material/material.module';

import { SearchFilterPipe } from '@pipes/search-filter.pipe';
import { StatusPipe } from '@pipes/status.pipe';

import { RoleDirective } from '@shared/directives/role.directive';
import { ShellComponent } from '@shared/layout/shell/shell.component';
import { FooterComponent } from '@shared/layout/footer/footer.component';
import { SectionFooterComponent } from '@shared/layout/section-footer/section-footer.component';
import { SectionHeaderComponent } from '@shared/layout/section-header/section-header.component';
import { BaseItemsListComponent } from '@shared/components/base-items-list/base-items-list.component';
import { BaseItemsTableComponent } from '@shared/components/base-items-table/base-items-table.component';
import { BaseItemDialogComponent } from '@shared/components/base-item-dialog/base-item-dialog.component';
import { BaseItemDetailComponent } from '@shared/components/base-item-detail/base-item-detail.component';
import { BaseItemsPanelComponent } from '@shared/components/base-items-panel/base-items-panel.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { RoleOptionsComponent } from '@shared/components/role-options/role-options.component';
import { StoriesPanelComponent } from '@shared/components/stories-panel/stories-panel.component';
import { CommentsDialogComponent } from '@shared/components/comments-dialog/comments-dialog.component';
import { AuditItemsListComponent } from '@shared/components/audit-items-list/audit-items-list.component';

const components = [
  ShellComponent,
  FooterComponent,
  SectionHeaderComponent,
  SectionFooterComponent,
  BaseItemDetailComponent,
  BaseItemDialogComponent,
  BaseItemsListComponent,
  BaseItemsTableComponent,
  BaseItemDetailComponent,
  BaseItemsPanelComponent,
  AuditItemsListComponent,
  CommentsDialogComponent,
  StoriesPanelComponent,
  SpinnerComponent,
  RoleOptionsComponent,
];

const pipes = [
  SearchFilterPipe,
  StatusPipe,
];

const directives = [
  RoleDirective,
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
    ...directives,
    ...pipes,
  ],
  imports: [
    ...modules
  ],
  exports: [
    ...modules,
    ...components,
    ...directives,
    ...pipes,
  ]
})
export class SharedModule { }
