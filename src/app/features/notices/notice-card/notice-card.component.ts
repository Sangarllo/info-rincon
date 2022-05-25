import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { INotice, Notice } from '@models/notice';
import { PictureService } from '@services/pictures.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-notice-card',
  templateUrl: './notice-card.component.html',
  styleUrls: ['./notice-card.component.scss']
})
export class NoticeCardComponent implements OnInit {

  @Input() notice: INotice;

  constructor(
    private pictureSrv: PictureService,
    private spinnerSvc: SpinnerService,
    private router: Router,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;
    // this.notice.extra2 = ( this.notice.categories ) ? this.notice.categories.reduce(reducer, '') : '';

    this.spinnerSvc.hide();
  }

  getMediumImage(image: string): string {
    return this.pictureSrv.getMediumImage(image);
  }

  gotoNotice(): void {
    this.router.navigate([`/${Notice.PATH_URL}/${this.notice.id}`]);
  }
}
