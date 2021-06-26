import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { INotice } from '@models/notice';

@Component({
  selector: 'app-notice-expansion-panel',
  templateUrl: './notice-expansion-panel.component.html',
  styleUrls: ['./notice-expansion-panel.component.scss']
})
export class NoticeExpansionPanelComponent implements OnInit {

  @Input() notice: INotice;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
}
