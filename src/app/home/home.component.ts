import { Component, OnInit } from '@angular/core';import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  items: Observable<any[]>;

  constructor(
    firestore: AngularFirestore,
    private seo: SeoService
  ) {
    this.items = firestore.collection('items').valueChanges();
  }

  ngOnInit(): void {
    this.seo.generateTags({
      title: 'Home | InfoRincon',
      description: 'Módulo Home de InfoRincon'
    });
  }
}
