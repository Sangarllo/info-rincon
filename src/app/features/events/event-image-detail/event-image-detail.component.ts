import { Component, Input } from '@angular/core';

import { IEvent } from '@models/event';
import { IPicture } from '@models/picture';
import { PictureService } from '@services/pictures.service';

@Component({
  selector: 'app-event-image-detail',
  templateUrl: './event-image-detail.component.html',
  styleUrls: ['./event-image-detail.component.scss']
})
export class EventImageDetailComponent {

  // @Input() event: IEvent;
  @Input() eventPicture: IPicture;

  constructor(
    private pictureSrv: PictureService,
  ) { }

  public viewImage(): void {
    window.open(this.eventPicture.pathLarge, '_blank');
  }

  getMediumImage(image: string): string {
    return this.pictureSrv.getMediumImage(image);
  }
}
