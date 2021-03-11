import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { EventsRoutingModule } from '@app/events/events-routing.module';
import { EventsComponent } from '@app/events/events.component';
import { EventViewComponent } from '@app/events/event-view/event-view.component';
import { EventAdminComponent } from '@app/events/event-admin/event-admin.component';
import { EventEditComponent } from '@app/events/event-edit/event-edit.component';
import { EventBasicDialogComponent } from '@app/events/event-basic-dialog/event-basic-dialog.component';
import { EventBasicDetailComponent } from '@app/events/event-basic-detail/event-basic-detail.component';
import { EventStatusDialogComponent } from '@app/events/event-status-dialog/event-status-dialog.component';
import { EventStatusDetailComponent } from '@app/events/event-status-detail/event-status-detail.component';
import { EventAppointmentDialogComponent } from '@app/events/event-appointment-dialog/event-appointment-dialog.component';
import { EventAppointmentDetailComponent } from '@app/events/event-appointment-detail/event-appointment-detail.component';
import { EventImageDialogComponent } from '@app/events/event-image-dialog/event-image-dialog.component';
import { EventImageDetailComponent } from '@app/events/event-image-detail/event-image-detail.component';
import { EventNewBaseDialogComponent } from '@app/events/event-new-base-dialog/event-new-base-dialog.component';
import { EventScheduleDialogComponent } from './event-schedule-dialog/event-schedule-dialog.component';
import { EventCreationComponent } from './event-creation/event-creation.component';

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
