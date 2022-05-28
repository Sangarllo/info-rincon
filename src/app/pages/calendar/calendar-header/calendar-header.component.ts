import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CalendarView } from 'angular-calendar';

import { EventsSearchDialogComponent } from '@features/events/events-search-dialog/events-search-dialog.component';
import { Base, IBase } from '@models/base';
import { CalendarEntitiesDialogComponent } from '@pages/calendar/calendar-entities-dialog/calendar-entities-dialog.component';
import { CalendarModeDialogComponent } from '@pages/calendar/calendar-mode-dialog/calendar-mode-dialog.component';
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
  @Output() entitySelectedChange = new EventEmitter<string[]>();

  public dialogConfig = new MatDialogConfig();
  CalendarView = CalendarView;
  modeSelected: string;

  entityFilteredOption: string;
  entityFiltered: IBase;

  constructor(
    public dialog: MatDialog,
    private utilsSrv: UtilsService,
  ) {}

  gotoEventSearch() {
    const dialogRef1 = this.dialog.open(EventsSearchDialogComponent);
  }

  gotoModeConfig() {

    console.log('gotoModeConfig');

    this.dialogConfig.data = { view: this.view };
    this.dialogConfig.width = '500px';
    this.dialogConfig.height = '500px';

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
          // this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
        }
      });
    }

    gotoEntitiesConfig() {

      console.log(`gotoEntitiesConfig: ${this.entityFilteredOption} | ${this.entityFiltered?.name}`);

      this.dialogConfig.data = {
          option: this.entityFilteredOption,
          entity: this.entityFiltered
      };
      this.dialogConfig.width = '500px';
      this.dialogConfig.height = '500px';

      const dialogRef2 = this.dialog.open(CalendarEntitiesDialogComponent, this.dialogConfig);

      dialogRef2.afterClosed().subscribe(([entityOption, entitySelected]: [string, IBase]) => {

          this.entityFilteredOption = entityOption;
          console.log(`closing - entityFilteredOption -> ${this.entityFilteredOption};`);

          this.entityFiltered = entitySelected?.id !== '0' ? entitySelected : null;

          if ( this.entityFilteredOption ) {

              let entities = [];
              switch (this.entityFilteredOption) {
                case '1': // cualquiera
                  entities = [];
                  break;
                case '2': // TODO favoritos - TODO
                  break;
                case '3': // una concreta
                  entities = [entitySelected.id];
              }
              this.entitySelectedChange.emit(entities);
          } else {
            // this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
          }
        });
    }

    public applyEntityFilteredStyles() {
        const styles = {
          background: `url('${this.entityFiltered.imagePath}') center no-repeat`,
        };
        return styles;
    }
}
