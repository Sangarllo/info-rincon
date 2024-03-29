import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SeoService } from '@services/seo.service';
import { IEntity } from '@models/entity';
import { IBase, BaseType } from '@models/base';

const ENTITIES_COLLECTION = 'entidades';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  private entityCollection!: AngularFirestoreCollection<IEntity>;
  private entityDoc!: AngularFirestoreDocument<IEntity>;

  constructor(
    private afs: AngularFirestore,
    private seo: SeoService,
  ) {
    this.entityCollection = afs.collection(ENTITIES_COLLECTION);
  }

  getAllEntities(): Observable<IEntity[]> {
    this.entityCollection = this.afs.collection<IEntity>(
      ENTITIES_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('name')
    );

    return this.entityCollection.valueChanges();
  }

  getAllEntitiesBase(): Observable<IBase[]> {
    this.entityCollection = this.afs.collection<IEntity>(
      ENTITIES_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('name')
    );

    return this.entityCollection.valueChanges().pipe(
      map(entities => entities.map(entity => {
        if ( entity.active ) {
          return {
            id: entity.id,
            active: entity.active,
            name: entity.name,
            imageId: entity.imageId,
            imagePath: entity.imagePath,
            baseType: BaseType.ENTITY,
            description: entity.roleDefault
          };
        }
      }))
    );
  }

  getOneEntity(idEntity: string): Observable<IEntity | undefined> {
    return this.entityCollection
      .doc(idEntity)
      .valueChanges({ idField: 'id' });
  }

  getSeveralEntities(entities: string[]): Observable<IEntity[]>{

    const eventsObs: Observable<IEntity>[] = [];
    entities.forEach(entityId => {
      eventsObs.push(this.getOneEntity(entityId));
    });

    return combineLatest(eventsObs);
  }

  addEntity(entity: IEntity): void {
    entity.id = this.afs.createId();
    console.log(`addEntity service: ${JSON.stringify(entity)}`);
    this.entityCollection.doc(entity.id).set(entity);
  }

  updateEntity(entity: IEntity): void {
    const idEntity = entity.id;
    this.entityDoc = this.afs.doc<IEntity>(`${ENTITIES_COLLECTION}/${idEntity}`);

    const updEntity = { ...entity, place: entity.place };
    this.entityDoc.set(updEntity, { merge: true });
  }

  deleteEntity(entity: IEntity): void {
    const idEntity = entity.id;
    entity.active = false;
    this.entityDoc = this.afs.doc<IEntity>(`${ENTITIES_COLLECTION}/${idEntity}`);
    this.entityDoc.update(entity);
  }
}
