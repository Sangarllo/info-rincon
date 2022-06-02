import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { AuditRoutingModule } from '@features/audit/audit-routing.module';
import { AuditComponent } from '@features/audit/audit.component';

@NgModule({
  declarations: [
    AuditComponent
  ],
  imports: [
    SharedModule,
    AuditRoutingModule
  ],
})
export class AuditModule { }
