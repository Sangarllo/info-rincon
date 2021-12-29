import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

import { LogService } from '@services/log.service';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private baseUrl = environment.baseUrl;

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private logSrv: LogService,
  ) { }

  generateTags({ title = '', description = '', image = '' }): void {
    this.logSrv.info(`generating tags: ${title}`);
    this.title.setTitle(title);

    // Open Graph
    this.meta.updateTag({ property: 'og:url', content: `${this.baseUrl}${this.router.url}` });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });

    this.meta.addTag(
      {name: 'fb:app_id', content: '1386530691696376'},
      true
    );

    this.meta.updateTag({ property: 'og:type', content: 'article' });

    this.meta.updateTag({name: 'description', content: `description: ${description}`});

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
  }

  // public changeTags(): void {
  //   this.title.setTitle('Rincón de Soto 2');
  //   this.meta.updateTag({ name: 'description', content: 'Description 2' });
  // }
}
