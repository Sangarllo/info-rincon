import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { PlaceService } from '@services/places.service';
import { PictureService } from '@services/pictures.service';
import { SpinnerService } from '@services/spinner.service';
import { IPlace } from '@models/place';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public viewMode = 'cards';
  public loading = true;
  public places: IPlace[];
  public dataSource: MatTableDataSource<IPlace> = new MatTableDataSource();
  displayedColumns: string[] = [ 'id', 'image', 'collapsed-info', 'name', 'types', 'locality',  'actions3'];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private router: Router,
    private spinnerSvc: SpinnerService,
    private placeSrv: PlaceService,
    private pictureSrv: PictureService,

  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {
    const subs1$ = this.placeSrv.getAllPlaces()
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

    this.listOfObservers.push(subs1$);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getThumbnail(image: string): string {
    return this.pictureSrv.getThumbnail(image);
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
        Swal.fire({
          title: '¡Borrado!',
          text: `${place.name} ha sido borrado`,
          icon: 'success',
          confirmButtonColor: '#003A59',
        });
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`lugares/0/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }
}

