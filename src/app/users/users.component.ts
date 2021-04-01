import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';

import { IUser } from '@models/user';
import { UserService } from '@services/users.service';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public users: IUser[];
  public dataSource: MatTableDataSource<IUser> = new MatTableDataSource();
  displayedColumns: string[] = [ 'role', 'uid', 'photoURL', 'displayName', 'email', 'entities',  'actions3', 'collapsed-info'];

  constructor(
    private router: Router,
    private logSrv: LogService,
    private userSrv: UserService,
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.userSrv.getAllUsers()
    .subscribe( (users: IUser[]) => {
      this.users = users;
      this.dataSource = new MatTableDataSource(this.users);
      this.loading = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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

  public deleteUser(user: IUser): void {
    this.logSrv.info(`deleting ${user.uid}`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción de borrado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userSrv.deleteUser(user);
        Swal.fire(
          '¡Borrado!',
          `${user.displayName} ha sido borrado`,
          'success'
        );
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`usuarios/0/editar`]);
  }
}
