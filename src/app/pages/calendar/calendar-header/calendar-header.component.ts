import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Subscription } from 'rxjs';
import { CalendarView } from 'angular-calendar';

import { EventsSearchDialogComponent } from '@features/events/events-search-dialog/events-search-dialog.component';
import { CalendarEntitiesDialogComponent } from '@pages/calendar/calendar-entities-dialog/calendar-entities-dialog.component';
import { CalendarModeDialogComponent } from '@pages/calendar/calendar-mode-dialog/calendar-mode-dialog.component';
import { Base, IBase } from '@models/base';
import { IUser } from '@models/user';
import { UserService } from '@services/users.service';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
})
export class CalendarHeaderComponent implements OnInit, OnDestroy {

  @Input() view: CalendarView;
  @Input() entityId: string;
  @Input() viewDate: Date;
  @Input() locale = 'es';

  @Output() viewChange = new EventEmitter<CalendarView>();
  @Output() viewDateChange = new EventEmitter<Date>();
  @Output() filterEntitiesChange = new EventEmitter<string[]>();

  public dialogConfig = new MatDialogConfig();
  CalendarView = CalendarView;
  modeSelected: string;

  userLogged: IUser;
  entities: string[] = [];
  public favEntities: string[] = [];
  entityFilteredOption: string;
  entityFiltered: IBase;

  private listOfObservers: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    public auth: AngularFireAuth,
    private userSrv: UserService,
  ) {}

  ngOnInit(): void {

    const subs1$ = this.auth.user.subscribe((usr) => {
      const uidUser = usr?.uid;
      this.userSrv.getOneUser(uidUser)
      .subscribe( (user: IUser) => {
        this.userLogged = user;
        this.favEntities = this.userLogged?.favEntities;
      });
    });

    this.listOfObservers.push(subs1$);
  }

  gotoEventSearch() {
    const dialogRef1 = this.dialog.open(EventsSearchDialogComponent);
  }

  gotoModeConfig() {

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

      this.dialogConfig.data = {
          option: this.entityFilteredOption,
          entity: this.entityFiltered,
          favEntities: this.favEntities,
      };
      this.dialogConfig.width = '500px';
      this.dialogConfig.height = '500px';

      // console.log(`favEntities: ${this.favEntities.length}`);

      const dialogRef2 = this.dialog.open(CalendarEntitiesDialogComponent, this.dialogConfig);

      dialogRef2.afterClosed().subscribe(([entityOption, entitySelected]: [string, IBase]) => {

          this.entityFilteredOption = entityOption;
          this.entityFiltered = entitySelected?.id !== '0' ? entitySelected : null;

          if ( this.entityFilteredOption ) {

              this.entities = [];
              switch (this.entityFilteredOption) {
                case '1': // cualquiera
                  this.entities = [];
                  break;
                case '2': // favoritos
                  this.entities = this.favEntities;
                  break;
                case '3': // una concreta
                  this.entities = [entitySelected.id];
              }
              this.filterEntitiesChange.emit(this.entities);
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

    ngOnDestroy(): void {
      this.listOfObservers.forEach(sub => sub.unsubscribe());
    }
}
