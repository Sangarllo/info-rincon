import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AuditService } from '@services/audit.service';
import { IAuditItem } from '@models/audit';

@Component({
  selector: 'app-user-audit',
  templateUrl: './user-audit.component.html',
  styleUrls: ['./user-audit.component.scss']
})
export class UserAuditComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public auditItems: IAuditItem[];
  public dataSource: MatTableDataSource<IAuditItem> = new MatTableDataSource();
  displayedColumns: string[] = [ 'auditType', 'timestamp', 'image', 'name', 'desc' ];

  constructor(
    private route: ActivatedRoute,
    private auditSrv: AuditService,
  ) {
    this.loading = true;
  }

  ngOnInit(): void {

    const uidUser = this.route.snapshot.paramMap.get('uid');
    if ( uidUser ) {
      this.auditSrv.getAllAuditItemsByUser(uidUser)
      .subscribe( (auditItems: IAuditItem[]) => {
        this.auditItems = auditItems;
        this.dataSource = new MatTableDataSource(this.auditItems);
        this.loading = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
