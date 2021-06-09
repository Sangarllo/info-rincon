import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LogService } from '@services/log.service';
import { IBase, Base } from '@models/base';

@Component({
  selector: 'app-base-items-panel',
  templateUrl: './base-items-panel.component.html',
  styleUrls: ['./base-items-panel.component.scss']
})
export class BaseItemsPanelComponent implements OnInit {

  @Input() baseItems: IBase[];
  @Input() alerted: boolean;

  constructor(
    private router: Router,
    private logSrv: LogService,
  ) { }

  ngOnInit(): void {
  }

  gotoItem(item: IBase): void {
    const baseItemUrl = Base.getUrl(item);
    this.router.navigate([`${baseItemUrl}`]);
  }

}
