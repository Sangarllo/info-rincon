import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CalendarView } from 'angular-calendar';

import { EventsSearchDialogComponent } from '@features/events/events-search-dialog/events-search-dialog.component';
import { Base, IBase } from '@models/base';
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
  entityFiltered: IBase;

  constructor(
    public dialog: MatDialog,
    private utilsSrv: UtilsService,
  ) {}

  gotoEventSearch() {
    const dialogRef1 = this.dialog.open(EventsSearchDialogComponent);
  }

  gotoModeConfig() {

    console.log('gotoModeConfig this.entityId: ', JSON.stringify(this.entityId));


    this.dialogConfig.data = { view: this.view, entity: this.entityId };
    this.dialogConfig.width = '500px';
    this.dialogConfig.height = '500px';

    const dialogRef2 = this.dialog.open(CalendarModeDialogComponent, this.dialogConfig);

    dialogRef2.afterClosed().subscribe(([modeSelected, entitySelected]: [string, IBase]) => {

        this.entityFiltered = entitySelected.id !== '0' ? entitySelected : null;
        // console.log('modeSelected', modeSelected);
        // console.log('entitySelected', JSON.stringify(entitySelected));

        if ( modeSelected || this.entityFiltered ) {

            if ( entitySelected) {
              this.entityId = entitySelected.id;
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

    public applyEntityFilteredStyles() {
        const styles = {
          background: `url('${this.entityFiltered.image}') center no-repeat`,
          'background-size': 'cover',
          border: '2px solid #003A59',
        };
        return styles;
    }
}
