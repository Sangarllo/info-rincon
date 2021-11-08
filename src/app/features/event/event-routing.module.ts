import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventResolverComponent } from '@features/event/event-resolver/event-resolver.component';

const routes: Routes = [
  {
    path: ':sanitized-url',
    component: EventResolverComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
