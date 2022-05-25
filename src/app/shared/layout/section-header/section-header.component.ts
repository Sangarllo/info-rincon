import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() showViewMode = false;

  @Output() viewMode = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  setViewMode(mode: string): void {
    console.log(`mode: ${mode}`);
    this.viewMode.emit(mode);
  }
}
