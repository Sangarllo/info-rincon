import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.seo.generateTags({
      title: 'Home | InfoRincon',
      description: 'Módulo Home de InfoRincon'
    });
  }
}
