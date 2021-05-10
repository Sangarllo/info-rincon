import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IBase } from '@models/base';

@Component({
  selector: 'app-base-item-detail',
  templateUrl: './base-item-detail.component.html',
  styleUrls: ['./base-item-detail.component.scss']
})
export class BaseItemDetailComponent {

  @Input() baseItem: IBase;

  constructor(
    private router: Router,
  ) { }

  gotoItem(): void {
    const baseItemUrl = this.baseItem.getUrl();
    this.router.navigate([`${baseItemUrl}`]);
  }
}
