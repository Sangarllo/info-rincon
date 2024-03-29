import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { DateAdapter } from '@angular/material/core';

import { CustomDateAdapter } from '@services/custom-date-adapter.service';

import { SharedModule } from '@shared/shared.module';
import { EventsRoutingModule } from '@features/events/events-routing.module';
import { EventsComponent } from '@features/events/events.component';
import { EventsFavComponent } from '@features/events/events-fav/events-fav.component';
import { EventsAuditComponent } from '@features/events/events-audit/events-audit.component';
import { EventsEntitiesComponent } from '@features/events/events-entities/events-entities.component';
import { EventsOwnComponent } from '@features/events/events-own/events-own.component';
import { EventViewComponent } from '@features/events/event-view/event-view.component';
import { EventConfigComponent } from '@features/events/event-config/event-config.component';
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
import { EventRefDialogComponent } from '@features/events/event-ref-dialog/event-ref-dialog.component';
import { EventCreationComponent } from '@features/events/event-creation/event-creation.component';
import { EventItemDetailComponent } from '@features/events/event-item-detail/event-item-detail.component';
import { EventItemDialogComponent } from '@features/events/event-item-dialog/event-item-dialog.component';
import { EventsSearchDialogComponent } from '@features/events/events-search-dialog/events-search-dialog.component';
import { CalendarEventItemsPanelComponent } from '@features/events/calendar-event-items-panel/calendar-event-items-panel.component';
import { EventCardComponent } from '@features/events/event-card/event-card.component';
import { EventWikiComponent } from '@features/events/event-wiki/event-wiki.component';
import { EventSocialComponent } from '@features/events/event-social/event-social.component';
import { EventsAuditSocialComponent } from '@features/events/events-audit-social/events-audit-social.component';
import { ShEventsTableComponent } from '@features/events/sh-events-table/sh-events-table.component';

@NgModule({
  declarations: [
    EventsComponent,
    EventsAuditComponent,
    EventsAuditSocialComponent,
    EventsFavComponent,
    EventsEntitiesComponent,
    EventsOwnComponent,
    EventCardComponent,
    EventViewComponent,
    EventSocialComponent,
    EventConfigComponent,
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
    EventRefDialogComponent,
    EventCreationComponent,
    EventItemDetailComponent,
    EventItemDialogComponent,
    EventsSearchDialogComponent,
    CalendarEventItemsPanelComponent,
    EventWikiComponent,
    ShEventsTableComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    EventsRoutingModule
  ],
  exports: [
    EventItemDetailComponent,
    EventItemDialogComponent,
    CalendarEventItemsPanelComponent,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter
    },
    {
      provide: LOCALE_ID, useValue: 'es'
    },
  ]
})
export class EventsModule { }
