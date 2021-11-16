import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CalendarView } from 'angular-calendar';

import { EventsSearchDialogComponent } from '@features/events/events-search-dialog/events-search-dialog.component';
import { CalendarModeDialogComponent } from '@pages/calendar/calendar-mode-dialog.component';
import { SwalMessage, UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
})
export class CalendarHeaderComponent {

  @Input() view: CalendarView;
  @Input() viewDate: Date;
  @Input() locale = 'es';

  @Output() viewChange = new EventEmitter<CalendarView>();
  @Output() viewDateChange = new EventEmitter<Date>();

  public dialogConfig = new MatDialogConfig();
  CalendarView = CalendarView;
  modeSelected: string;

  constructor(
    public dialog: MatDialog,
    private utilsSrv: UtilsService,
  ) {}

  gotoEventSearch() {
    const dialogRef1 = this.dialog.open(EventsSearchDialogComponent);
  }

  gotoModeConfig() {

    this.dialogConfig.data = { view: this.view };
    this.dialogConfig.width = '500px';
    this.dialogConfig.height = '300px';

    const dialogRef2 = this.dialog.open(CalendarModeDialogComponent, this.dialogConfig);

    dialogRef2.afterClosed().subscribe((modeSelected: string) => {
        if ( modeSelected ) {
            switch (modeSelected) {
              case 'CalendarView.Day':
                this.view = CalendarView.Day;
                this.viewChange.emit(CalendarView.Day);
                break;
              case 'CalendarView.Week':
                this.view = CalendarView.Week;
                this.viewChange.emit(CalendarView.Week);
                break;
              default:
                this.view = CalendarView.Month;
                this.viewChange.emit(CalendarView.Month);
            }
        } else {
          this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
        }
      });
    }
}
