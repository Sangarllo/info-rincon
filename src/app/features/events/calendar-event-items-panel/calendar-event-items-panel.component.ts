import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';

import { IPlace } from '@models/place';
import { IBase } from '@models/base';

import { CalendarEventsService } from '@services/calendar-events.service';

@Component({
  selector: 'app-calendar-event-items-panel',
  templateUrl: './calendar-event-items-panel.component.html',
  styleUrls: ['./calendar-event-items-panel.component.scss']
})
export class CalendarEventItemsPanelComponent implements OnInit {

  @Input() calendarEvents: CalendarEvent[];
  public onlyEvent: IBase;
  public eventPlace: IPlace;
  public eventStart: string;
  public dialogConfig = new MatDialogConfig();
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    private calendarEventsSrv: CalendarEventsService

  ) { }

  ngOnInit(): void {
    // console.log(`CalEventsPanel: ${JSON.stringify(this.calendarEvents)}`);
    if ( this.calendarEvents.length === 1 ) {
      const calEvent = this.calendarEvents[0];
      this.calendarEventsSrv.getBaseFromCalendarEvent(calEvent)
        .subscribe( ( base: IBase ) => {
          // console.log(`CalEventsPanel2: ${JSON.stringify(base)}`);
          this.onlyEvent = base;
        })
    }
  }

  openCalendarEventClicked(event: CalendarEvent): void {
    this.calendarEventsSrv.openCalendarEventClicked(event);
  }


  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
