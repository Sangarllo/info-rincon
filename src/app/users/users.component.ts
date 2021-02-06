import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.seo.generateTags({
      title: 'Users | InfoRincon',
      description: 'Módulo Users de InfoRincon'
    });
  }
}
