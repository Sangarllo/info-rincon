import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CalendarView } from 'angular-calendar';

import { EventsSearchDialogComponent } from '@features/events/events-search-dialog/events-search-dialog.component';
import { IBase } from '@models/base';
import { CalendarModeDialogComponent } from '@pages/calendar/calendar-mode-dialog.component';
import { SwalMessage, UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
})
export class CalendarHeaderComponent {

  @Input() view: CalendarView;
  @Input() entityId: string;
  @Input() viewDate: Date;
  @Input() locale = 'es';

  @Output() viewChange = new EventEmitter<CalendarView>();
  @Output() viewDateChange = new EventEmitter<Date>();
  @Output() entitySelectedChange = new EventEmitter<IBase>();

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

    this.dialogConfig.data = { view: this.view, entity: this.entityId };
    this.dialogConfig.width = '500px';
    this.dialogConfig.height = '500px';

    const dialogRef2 = this.dialog.open(CalendarModeDialogComponent, this.dialogConfig);

    dialogRef2.afterClosed().subscribe(([modeSelected, entitySelected]: [string, IBase]) => {

        console.log('afterClose');
        console.log('modeSelected', modeSelected);
        console.log('entitySelected', JSON.stringify(entitySelected));

        if ( modeSelected || entitySelected ) {

            if ( entitySelected) {
              console.log('entitySelected', JSON.stringify(entitySelected));
              this.entitySelectedChange.emit(entitySelected);
            }

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
          }

        } else {
          // this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
        }
      });
    }
}
