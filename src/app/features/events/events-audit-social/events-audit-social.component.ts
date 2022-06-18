import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

import { IAuditSocialItem } from '@models/audit-social';
import { IUser } from '@models/user';
import { AuditSocialService } from '@services/audit-social.service';
import { SpinnerService } from '@services/spinner.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-events-audit-social',
  templateUrl: './events-audit-social.component.html',
  styleUrls: ['./events-audit-social.component.scss']
})
export class EventsAuditSocialComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public viewMode = 'list';
  public auditSocialItems: IAuditSocialItem[] = [];
  public dataSource: MatTableDataSource<IAuditSocialItem> = new MatTableDataSource();
  displayedColumns: string[] = [
      'status', 'timestamp',
      'image', 'collapsed-info', 'name',
      'auditCreation', 'auditLastItem', 'nAuditItems'
];
  private listOfObservers: Array<Subscription> = [];
  private currentUser: IUser;

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private spinnerSvc: SpinnerService,
    private auditSocialSrv: AuditSocialService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const dateMin = '2022-01-01';
    const dateMax = '2025-01-01';

      const subs2$ = this.auditSocialSrv.getAuditItemsByRange(dateMin, dateMax)

      .pipe(
        map(auditItems => auditItems.map(item => {

          item.timestamp = formatDistance(new Date(item.timestamp), new Date(), {locale: es});

          return { ...item };
        }))
      )
      .subscribe( (auditSocialItems: IAuditSocialItem[]) => {
          this.auditSocialItems = auditSocialItems;
              // this.dataSource = new MatTableDataSource(this.events);
          this.spinnerSvc.hide();

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });

      this.listOfObservers.push(subs2$);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

}
