import { Component, Input } from '@angular/core';
import { IBase } from 'src/app/core/models/base';

@Component({
  selector: 'sh-base-admin',
  templateUrl: './base-items-admin.component.html'
})
export class BaseItemsAdminComponent {

  @Input() baseItems: IBase[];

  constructor() { }
}
