import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { IBase, Base, BaseType } from '@models/base';
import { IEvent } from '@models/event';
import { LinkItemType, LINK_ITEM_TYPE_DEFAULT } from '@models/link-item-type.enum';
import { IPicture } from '@models/picture';
import { UtilsService, SwalMessage } from '@services/utils.service';
import { PictureService } from '@services/pictures.service';

@Component({
  selector: 'app-link-item-dialog',
  templateUrl: './link-item-dialog.component.html',
})
export class LinkItemDialogComponent implements OnInit, OnDestroy {

  pictureSelected: IPicture;
  pictures: IPicture[];

  title = 'Crea un enlace para este evento';
  event: IEvent;
  linkItemForm: FormGroup;
  thisLinkId: string;
  imageIdSelected: string;
  imagePathSelected: string;
  // public urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public urlRegex = '^(https?://)(.*)';
  readonly IMAGE_BLANK: string = Base.IMAGE_DEFAULT;
  readonly LINK_ITEM_TYPE_IMAGE = LinkItemType.Imagen;

  linkItemType = LINK_ITEM_TYPE_DEFAULT;
  // linkItemTypeControl = new FormControl();
  readonly LINK_ITEM_TYPES = LinkItemType;
  readonly LINK_ITEM_TYPES_KEYS = Object.keys(LinkItemType);

  private listOfObservers: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private utilsSrv: UtilsService,
    private pictureSrv: PictureService,
    public dialogRef: MatDialogRef<LinkItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  // Using desc to swich operation:
  //  '' -> CREATE SCHEDULE ITEM
  //  'X' -> EDIT SCHEDULE X

  ngOnInit(): void {

    this.event = this.data.event;
    this.title = this.data.dialogTitle;

    this.getPictures();

    this.linkItemForm = this.fb.group({
        id: [ {value: '', disabled: true}, []],
        name: [ {value: '', disabled: true}, []],
        description: [ '', []],
        linkItemType: [ '', []],
        imageId: [ '', []],
        imagePath: [ '', []],
        sourceUrl: ['', [Validators.required, Validators.pattern(this.urlRegex)]],
        sourceName: [ '', []],
    });

    // this.linkItemTypeControl.setValue(LinkItemTypes.UrlExterna);

    const GUID = this.utilsSrv.getGUID();
    console.log(`GUID: ${GUID}`);
    this.thisLinkId = `${GUID}`;
    const name = `Nuevo enlace`;
    this.imageIdSelected = this.event.imageId;
    this.imagePathSelected = this.event.imagePath;
    const sourceName = this.data.dialogSourceName;

    this.linkItemForm.patchValue({
      id: this.thisLinkId,
      name,
      description: name,
      imageId: this.imageIdSelected,
      imagePath: this.imagePathSelected,
      sourceUrl: '',
      sourceName,
    });
  }

  getPictures(): void {
    this.pictureSrv.getPictureFromImage(this.event.imageId)
      .subscribe((picture: IPicture) => {
        this.pictureSelected = picture;
      });

    this.pictureSrv.getSeveralPicturesFromImages(this.event.images)
      .subscribe((pictures: IPicture[]) => {
        this.pictures = pictures;
      });
  }

  onSelectedImage(picture: IPicture): void {
    this.pictureSelected = picture;
    this.linkItemForm.patchValue({
        sourceUrl: this.pictureSelected.path
    });
  }

  onLinkItemTypeChange(key: string){
    // console.log(`linkItemType: ${key}`);
    this.linkItemForm.controls.linkItemType.setValue(key);
    this.linkItemForm.controls.name.setValue(key);
    this.linkItemForm.controls.description.setValue(key);
  }

  compareFunction(o1: any, o2: any): boolean {
    return (o1.name === o2.name && o1.id === o2.id);
  }

  comparePictureFunction(o1: any, o2: any): boolean {
    return (o1.id === o2.id);
  }

  onNoClick(): void {
    this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  save(): void {

    console.log(`saving: ${this.linkItemForm.controls.linkItemType.value}`);

    const newBase: IBase = {
      id: this.thisLinkId,
      active: true,
      name: this.linkItemForm.controls.name.value,
      description: this.linkItemForm.controls.description.value,
      sourceUrl: this.linkItemForm.controls.sourceUrl.value,
      sourceName: this.linkItemForm.controls.sourceName.value,
      imageId: this.pictureSelected.id,
      imagePath: this.pictureSelected.path,
      baseType: BaseType.LINK,
      extra: this.linkItemForm.controls.linkItemType.value // icons
    };

    this.dialogRef.close(newBase);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
