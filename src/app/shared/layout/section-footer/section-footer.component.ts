import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-footer',
  templateUrl: './section-footer.component.html',
  styleUrls: ['./section-footer.component.scss']
})
export class SectionFooterComponent {

  @Input() text: string;
  constructor(
  ) { }
}
