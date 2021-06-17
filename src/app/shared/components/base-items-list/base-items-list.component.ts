import { Component, Input } from '@angular/core';
import { IBase } from '@models/base';

@Component({
  selector: 'sh-base-items-list',
  templateUrl: './base-items-list.component.html',
  styleUrls: ['./base-items-list.component.scss']

})
export class BaseItemsListComponent {

  @Input() baseItems: IBase[];
  @Input() order: string = 'row'

  constructor() { }
}
