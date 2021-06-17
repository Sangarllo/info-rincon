import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { LogService } from '@services/log.service';
import { Base, IBase, BaseType } from '@models/base';

@Component({
  selector: 'app-event-item-detail',
  templateUrl: './event-item-detail.component.html',
  styleUrls: ['./event-item-detail.component.scss']
})
export class EventItemDetailComponent implements OnInit {

  @Input() eventItem: IBase;

  @Input() btnView: boolean;
  @Input() btnClose: boolean;

  @Output() onCloseClicked = new EventEmitter<void>();
  @Output() onViewClicked = new EventEmitter<void>();

  public superEventBase: IBase;

  constructor(
    private router: Router,
    private logSrv: LogService,
  ) {
  }

  ngOnInit(): void {
    console.log(`eventItem: ${JSON.stringify(this.eventItem)}`);

    if ( this.eventItem.extra ) {
      const data = this.eventItem.extra.split('|');
      this.superEventBase = Base.InitDefault();
      this.superEventBase.id = data[0];
      this.superEventBase.name = data[1];
      this.superEventBase.image = data[2];
      this.superEventBase.baseType = BaseType.EVENT;
    }
  }

  gotoEvent(): void {
    const baseItemUrl = Base.getUrl(this.eventItem);
    this.logSrv.info(`gotoBaseItem: ${baseItemUrl}`);
    this.router.navigate([`${baseItemUrl}`]);
  }

  gotoSuperEvent(): void {
    this.onCloseClicked.emit();
    const extraItemUrl = Base.getUrl(this.superEventBase);
    this.logSrv.info(`gotoExtraItem: ${extraItemUrl}`);
    this.router.navigate([`${extraItemUrl}`]);
  }


  onBtnCloseClick(): void {
    this.logSrv.info(`onBtnCloseClick`);
    this.onCloseClicked.emit();
  }

  onBtnViewClick(): void {
    this.logSrv.info(`onBtnViewClick`);
    this.gotoEvent();
    this.onViewClicked.emit();
  }

}
