import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
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
    console.log(`generating tags: ${title} | ${description} | ${image}`);
    this.title.setTitle(title);

    // Open Graph
    this.meta.updateTag({ property: 'og:url', content: `${this.baseUrl}${this.router.url}` });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:image', content: image });

    if ( description ) {
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({name: 'description', content: description});
    }

    this.meta.updateTag({ property: 'og:type', content: 'article' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
  }

  public updateDescription(description: string): void {
    console.log(`updateDescription: ${description}`);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  public updateDescrValues(values: string[]): void {
    const description = values.join(' ');
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  public changeTags(data: string): void {
    this.title.setTitle(`nuevo título 3 ${data}`);
    this.meta.updateTag({ name: 'description', content: `nueva descripción ${data}` });
    this.meta.updateTag({ property: 'og:title', content: `nuevo título ${data}` });
    this.meta.updateTag({ property: 'og:description', content: `nueva descipción ${data}` });
    this.meta.updateTag({ property: 'og:image', content: 'https://via.placeholder.com/1200x630' });
  }

  public updateTags( title: string, desc: string, image: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:image', content: image });
  }
}
