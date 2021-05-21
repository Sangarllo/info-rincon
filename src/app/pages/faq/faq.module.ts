import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { FaqRoutingModule } from '@pages/faq/faq-routing.module';
import { FaqComponent } from '@pages/faq/faq.component';


@NgModule({
  declarations: [FaqComponent],
  imports: [
    FaqRoutingModule,
    SharedModule,
  ]
})
export class FaqModule { }
