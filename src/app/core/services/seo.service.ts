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
    this.meta.addTags([
      {name: 'keywords', content: 'Rincón de Soto'},
      {name: 'description', content: description},
      {name: 'robots', content: 'index, follow'},
      // Open Graph
      { name: 'og:url', content: `${this.baseUrl}${this.router.url}` },
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },
      { name: 'og:image', content: image },
      { name: 'og:type', content: 'website' },
      // Facebook App
      { name: 'fb:app_id', content: '1386530691696376' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      // { name: 'twitter:site', content: '@fireship_dev' },
    ]);
  }
}
