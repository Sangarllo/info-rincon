import { Component, Input } from '@angular/core';

import { PictureService } from '@services/pictures.service';

@Component({
  selector: 'app-event-image-detail',
  templateUrl: './event-image-detail.component.html',
  styleUrls: ['./event-image-detail.component.scss']
})
export class EventImageDetailComponent {

  @Input() imagePath: string;

  constructor(
    private pictureSrv: PictureService,
  ) { }

  public viewImage(): void {
    window.open(this.imagePath, '_blank');
  }

  getMediumImage(image: string): string {
    return this.pictureSrv.getMediumImage(image);
  }
}
