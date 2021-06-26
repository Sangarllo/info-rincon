import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LogService } from '@services/log.service';
import { INotice } from '@models/notice';
import { Base } from '@models/base';

@Component({
  selector: 'app-notice-item-detail',
  templateUrl: './notice-item-detail.component.html',
  styleUrls: ['./notice-item-detail.component.scss']
})
export class NoticeItemDetailComponent implements OnInit {

  @Input() notice: INotice;

  constructor(
    private router: Router,
    private logSrv: LogService,
  ) {
  }


  ngOnInit(): void {
  }

  gotoEvent(): void {
    const baseItemUrl = Base.getUrl(this.notice);
    this.logSrv.info(`gotoBaseItem: ${baseItemUrl}`);
    this.router.navigate([`${baseItemUrl}`]);
  }

  onBtnViewClick(): void {
    this.logSrv.info(`onBtnViewClick`);
    this.gotoEvent();
  }

}
