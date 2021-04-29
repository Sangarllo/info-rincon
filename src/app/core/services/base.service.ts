import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IBase, BaseType } from 'src/app/core/models/base';
import { PlaceService } from '@services/places.service';
import { EntityService } from '@services/entities.service';

const PLACES_COLLECTION = 'lugares';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private entitiesSrv: EntityService,
    private placesSrv: PlaceService) {
  }

  getAllItemsBase(baseType: BaseType): Observable<IBase[]> {
    switch (baseType) {
      case BaseType.PLACE:
        return this.placesSrv.getAllPlacesBase();

      case BaseType.ENTITY:
        return this.entitiesSrv.getAllEntitiesBase();

      default:
        break;
    }
  }

}
