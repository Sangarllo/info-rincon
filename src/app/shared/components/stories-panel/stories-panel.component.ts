import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IBase, BaseType, Base } from '@models/base';

@Component({
  selector: 'app-stories-panel',
  templateUrl: './stories-panel.component.html',
  styleUrls: ['./stories-panel.component.scss']
})
export class StoriesPanelComponent implements OnInit {

  @Input() stories: IBase[];
  @Input() memories: IBase[];

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {

  }

  gotoItem(story: IBase): void {
    const baseItemUrl = Base.getUrl(story);
    this.router.navigate([`${baseItemUrl}`]);
  }

}
