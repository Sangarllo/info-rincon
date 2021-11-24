import { Component, VERSION } from '@angular/core';
import { environment } from '@environments/environment';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {

  angularVersion = `Angular ${VERSION.full}`;
  appVersion = environment.appVersion;
  releaseDate = environment.releaseDate;

  constructor(private swUpdate: SwUpdate) {}

  public updatePwa() {
    this.swUpdate.available.subscribe(() => window.location.reload());
  }
}
