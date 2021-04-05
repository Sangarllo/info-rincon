import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { PlaceService } from '@services/places.service';
import { SpinnerService } from '@services/spinner.service';
import { IPlace } from '@models/place';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public places: IPlace[];
  public dataSource: MatTableDataSource<IPlace> = new MatTableDataSource();
  displayedColumns: string[] = [ 'id', 'image', 'name', 'types', 'locality',  'actions3', 'collapsed-info'];

  constructor(
    private router: Router,
    private spinnerSvc: SpinnerService,
    private placeSrv: PlaceService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {
    this.placeSrv.getAllPlaces()
    .pipe(
      map(places => places.map(place => {
        const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

        place.description = ( place.types ) ? place.types.reduce(reducer, '') : '';
        return { ...place };
      }))
    )
    .subscribe( (places: IPlace[]) => {
      this.places = places;
      this.dataSource = new MatTableDataSource(this.places);
      this.spinnerSvc.hide();
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

  public gotoItem(place: IPlace): void {
    this.router.navigate([`lugares/${place.id}`]);
  }

  public editItem(place: IPlace): void {
    this.router.navigate([`lugares/${place.id}/editar`]);
  }

  public deleteItem(place: IPlace): void {
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
        this.placeSrv.deletePlace(place);
        Swal.fire(
          '¡Borrado!',
          `${place.name} ha sido borrado`,
          'success'
        );
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`lugares/0/editar`]);
  }
}
