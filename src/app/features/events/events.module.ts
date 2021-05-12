import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { EventsRoutingModule } from '@features/events/events-routing.module';
import { EventsComponent } from '@features/events/events.component';
import { EventViewComponent } from '@features/events/event-view/event-view.component';
import { EventAdminComponent } from '@features/events/event-admin/event-admin.component';
import { EventEditComponent } from '@features/events/event-edit/event-edit.component';
import { EventBasicDialogComponent } from '@features/events/event-basic-dialog/event-basic-dialog.component';
import { EventBasicDetailComponent } from '@features/events/event-basic-detail/event-basic-detail.component';
import { EventStatusDialogComponent } from '@features/events/event-status-dialog/event-status-dialog.component';
import { EventStatusDetailComponent } from '@features/events/event-status-detail/event-status-detail.component';
import { EventAppointmentDialogComponent } from '@features/events/event-appointment-dialog/event-appointment-dialog.component';
import { EventAppointmentDetailComponent } from '@features/events/event-appointment-detail/event-appointment-detail.component';
import { EventImageDialogComponent } from '@features/events/event-image-dialog/event-image-dialog.component';
import { EventImageDetailComponent } from '@features/events/event-image-detail/event-image-detail.component';
import { EventNewBaseDialogComponent } from '@features/events/event-new-base-dialog/event-new-base-dialog.component';
import { EventScheduleDialogComponent } from '@features/events/event-schedule-dialog/event-schedule-dialog.component';
import { EventCreationComponent } from '@features/events/event-creation/event-creation.component';

@NgModule({
  declarations: [
    EventsComponent,
    EventViewComponent,
    EventAdminComponent,
    EventEditComponent,
    EventBasicDialogComponent,
    EventBasicDetailComponent,
    EventStatusDialogComponent,
    EventStatusDetailComponent,
    EventAppointmentDialogComponent,
    EventAppointmentDetailComponent,
    EventImageDialogComponent,
    EventImageDetailComponent,
    EventNewBaseDialogComponent,
    EventScheduleDialogComponent,
    EventCreationComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule
  ],
  exports: [
  ]
})
export class EventsModule { }