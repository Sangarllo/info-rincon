import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { IBase, Base, BaseType } from '@models/base';
import { IEvent } from '@models/event';
import { UtilsService, SwalMessage } from '@services/utils.service';
import { LinkType, LINK_TYPE_DEFAULT } from '@models/link-type.enum';

@Component({
  selector: 'app-event-link-dialog',
  templateUrl: './event-link-dialog.component.html',
  styleUrls: ['./event-link-dialog.component.scss']
})
export class EventLinkDialogComponent implements OnInit, OnDestroy {

  title = 'Crea un enlace para este evento';

  event: IEvent;
  linkItemBase: IBase;

  linkItemForm: FormGroup;
  thisLinkId: string;
  orderId: number;
  linkType: LinkType;
  imageSelected: string;
  // public urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public urlRegex = '^(https?://)(.*)';
  readonly IMAGE_BLANK: string = Base.IMAGE_DEFAULT;
  readonly LINK_TYPE_URL = LinkType.UrlExterna;
  readonly LINK_TYPE_IMAGE = LinkType.Imagen;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private utilsSrv: UtilsService,
    public dialogRef: MatDialogRef<EventLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  // Using desc to swich operation:
  //  '' -> CREATE SCHEDULE ITEM
  //  'X' -> EDIT SCHEDULE X

  ngOnInit(): void {

    this.event = this.data.event;
    this.linkItemBase = this.data.linkItemBase;

    this.linkItemForm = this.fb.group({
        id: [ {value: '', disabled: true}, []],
        order: [ {value: '', disabled: true}, []],
        name: [ '', []],
        linkType: [ this.LINK_TYPE_URL, []],
        image: [ '', []],
        sourceUrl: ['', [Validators.required, Validators.pattern(this.urlRegex)]]
    });

    let name = '';
    let description = '';

    this.orderId = this.event.linkItems.length + 1;
    if ( this.linkItemBase ) {
      console.log(`linkItemBase: ${JSON.stringify(this.linkItemBase)}`);
      this.title = `Edita los datos de ${this.linkItemBase?.name}`;

      this.thisLinkId = this.linkItemBase.id;
      name = this.linkItemBase.name;
      description = this.linkItemBase.description;
      this.imageSelected = this.linkItemBase.image;
    } else {

      this.title = `Configura un nuevo enlace para este evento`;

      const GUID = this.utilsSrv.getGUID();
      console.log(`GUID: ${GUID}`);
      this.thisLinkId = `${GUID}`;
      name = `Enlace ${this.orderId}`;
      description = '';
      this.imageSelected = this.event.image;
    }

    this.linkItemForm.patchValue({
      id: this.thisLinkId,
      order: this.orderId,
      image: this.imageSelected,
      name,
      sourceUrl: this.linkItemBase?.description,
    });
  }

  onSelectedImage(path: string): void {
    console.log(`onSelectedImage: ${JSON.stringify(path)}`);
    this.imageSelected = path;
    this.linkItemForm.patchValue({
      sourceUrl: path
    });
  }

  compareFunction(o1: any, o2: any): boolean {
    return (o1.name === o2.name && o1.id === o2.id);
  }

  onNoClick(): void {
    this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  save(): void {

    const newBase: IBase = {
      id: this.thisLinkId,
      order: this.orderId,
      active: true,
      name: this.linkItemForm.controls.name.value,
      description: this.linkItemForm.controls.sourceUrl.value,
      image: this.imageSelected,
      baseType: BaseType.LINK,
    };

    this.dialogRef.close(newBase);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
