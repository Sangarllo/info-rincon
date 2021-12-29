import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { IUser } from '@models/user';
import { UserService } from '@services/users.service';
import { LogService } from '@services/log.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public users: IUser[];
  public dataSource: MatTableDataSource<IUser> = new MatTableDataSource();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  displayedColumns: string[] = [ 'role', 'uid', 'photoURL', 'collapsed-info', 'displayName', 'lastLogin', 'actions2'];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private router: Router,
    private logSrv: LogService,
    private spinnerSvc: SpinnerService,
    private userSrv: UserService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {
    const subs1$ = this.userSrv.getAllAudit()
    .subscribe( (users: IUser[]) => {
      this.users = users;
      this.dataSource = new MatTableDataSource(this.users);
      this.spinnerSvc.hide();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.listOfObservers.push(subs1$);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public gotoUser(user: IUser): void {
    this.router.navigate([`usuarios/${user.uid}`]);
  }

  public gotoItemAdmin(user: IUser): void {
    this.router.navigate([`usuarios/${user.uid}/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
