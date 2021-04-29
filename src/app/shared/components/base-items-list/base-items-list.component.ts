import { Component, Input } from '@angular/core';
import { IBase } from 'src/app/core/models/base';

@Component({
  selector: 'sh-base-items-list',
  templateUrl: './base-items-list.component.html'
})
export class BaseItemsListComponent {

  @Input() baseItems: IBase[];

  constructor() { }
}
