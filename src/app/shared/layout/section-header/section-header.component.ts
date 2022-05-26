import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Status } from '@models/status.enum';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() showViewMode = false;
  @Input() showStatusFilter = false;

  @Output() viewMode = new EventEmitter<string>();
  @Output() statusFiltered = new EventEmitter<Status[]>();

  STATUS_LIST = [
    { name: 'VISIBLE', value: Status.Visible, selected: true },
    { name: 'EDITANDO', value: Status.Editing, selected: true },
    { name: 'BLOQUEADO', value: Status.Blocked, selected: true },
    { name: 'ELIMINADO', value: Status.Deleted, selected: true },
  ];

  constructor(
  ) { }

  ngOnInit(): void {
  }

  setViewMode(mode: string): void {
    console.log(`mode: ${mode}`);
    this.viewMode.emit(mode);
  }

  setStatusFiltered(): void {
    const statusFiltered = this.STATUS_LIST.filter(status => status.selected).map(status => status.value);
    console.log(`statusFiltered: ${statusFiltered.length}`);
    this.statusFiltered.emit(statusFiltered);
  }

}
