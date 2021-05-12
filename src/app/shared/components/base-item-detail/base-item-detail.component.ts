import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Base, IBase } from '@models/base';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-base-item-detail',
  templateUrl: './base-item-detail.component.html',
  styleUrls: ['./base-item-detail.component.scss']
})
export class BaseItemDetailComponent {

  @Input() baseItem: Base;

  @Input() btnView: boolean;
  @Input() btnClose: boolean;

  @Output() onCloseClicked = new EventEmitter<void>();
  @Output() onViewClicked = new EventEmitter<void>();

  constructor(
    private logSrv: LogService,
    private router: Router,
  ) { }

  gotoBaseItem(): void {
    const baseItemUrl = Base.getUrl(this.baseItem);
    this.logSrv.info(`gotoBaseItem: ${baseItemUrl}`);
    this.router.navigate([`${baseItemUrl}`]);
  }

  onBtnCloseClick(): void {
    this.logSrv.info(`onBtnCloseClick`);
    this.onCloseClicked.emit();
  }

  onBtnViewClick(): void {
    this.logSrv.info(`onBtnViewClick`);
    this.gotoBaseItem();
    this.onViewClicked.emit();
  }

}
