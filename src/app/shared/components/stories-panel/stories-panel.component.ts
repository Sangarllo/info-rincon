/* eslint-disable max-len */
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IBase, Base } from '@models/base';
import { SwalMessage, UtilsService } from '@services/utils.service';

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
    private utilsSvc: UtilsService,
  ) { }

  ngOnInit(): void {

  }

  gotoItem(story: IBase): void {
    const baseItemUrl = Base.getUrl(story);
    this.router.navigate([`${baseItemUrl}`]);
  }

  previewItem(base: IBase): void {
    this.utilsSvc.swalFire(SwalMessage.GOTO_URL, '', base);
  }

}
