import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
  @Input() showOptionsMode = false;
  @Input() initialOptions: boolean[] = [false, false];

  @Output() viewMode = new EventEmitter<string>();
  @Output() statusFiltered = new EventEmitter<Status[]>();
  @Output() optionsMode = new EventEmitter<boolean[]>();

  showNoActive: boolean;
  showNoFavorite: boolean;

  STATUS_LIST = [
    { name: 'VISIBLE', value: Status.Visible, selected: true },
    { name: 'EDITANDO', value: Status.Editing, selected: true },
    { name: 'BLOQUEADO', value: Status.Blocked, selected: true },
    { name: 'ELIMINADO', value: Status.Deleted, selected: true },
  ];

  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.showNoActive = this.initialOptions[0];
    this.showNoFavorite = this.initialOptions[1];
    console.log(`showNoActive: ${this.showNoActive}`);
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

  emitOptionsMode(): void {
    const options = [ this.showNoActive, this.showNoFavorite ];
    console.log(`options: ${options}`);
    this.optionsMode.emit(options);
  }

  setOption($event: any){
    $event.stopPropagation();
    //Another instructions
  }
}
