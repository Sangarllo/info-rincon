import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { Subscription } from 'rxjs';

import { SpinnerService } from '@services/spinner.service';
import { AuditService } from '@services/audit.service';
import { IAuditItem } from '@models/audit';

@Component({
  selector: 'app-user-audit',
  templateUrl: './user-audit.component.html',
  styleUrls: ['./user-audit.component.scss']
})
export class UserAuditComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public auditItems: IAuditItem[];
  public dataSource: MatTableDataSource<IAuditItem> = new MatTableDataSource();
  displayedColumns: string[] = [ 'timestamp', 'image', 'name', 'desc' ];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private auditSrv: AuditService,
    private spinnerSvc: SpinnerService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const uidUser = this.route.snapshot.paramMap.get('uid');
    if ( uidUser ) {
      const subs1$ = this.auditSrv.getAllAuditItemsByUser(uidUser, 20)
        .subscribe( (auditItems: IAuditItem[]) => {
          this.auditItems = auditItems;
          this.dataSource = new MatTableDataSource(this.auditItems);
          this.spinnerSvc.hide();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

      this.listOfObservers.push(subs1$);
    }
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
