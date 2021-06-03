import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Base, IBase, BaseType } from '@models/base';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-base-item-detail',
  templateUrl: './base-item-detail.component.html',
  styleUrls: ['./base-item-detail.component.scss']
})
export class BaseItemDetailComponent implements OnInit {

  @Input() baseItem: IBase;

  @Input() btnView: boolean;
  @Input() btnClose: boolean;

  @Output() onCloseClicked = new EventEmitter<void>();
  @Output() onViewClicked = new EventEmitter<void>();

  public extraBase: IBase;

  constructor(
    private router: Router,
    private logSrv: LogService,
  ) { }

  ngOnInit(): void {
    if ( this.baseItem.extra ) {
      // For events -> if there is extra: base Item = schedule, extra = event
      const data = this.baseItem.extra.split('|');
      this.extraBase = Base.InitDefault();
      this.extraBase.id = data[0];
      this.extraBase.name = data[1];
      this.extraBase.image = data[2];
      this.extraBase.baseType = BaseType.EVENT;
    }
  }

  gotoBaseItem(): void {
    const baseItemUrl = Base.getUrl(this.baseItem);
    this.logSrv.info(`gotoBaseItem: ${baseItemUrl}`);
    this.router.navigate([`${baseItemUrl}`]);
  }

  gotoExtraItem(): void {
    this.onCloseClicked.emit();
    const extraItemUrl = Base.getUrl(this.extraBase);
    this.logSrv.info(`gotoExtraItem: ${extraItemUrl}`);
    this.router.navigate([`${extraItemUrl}`]);
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
