import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

import { ITags } from '@models/tags';
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
    // console.log(`generating tags: ${title} | ${description} | ${image}`);
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


  public updateTags( tags: ITags): void {
    // console.log(`updateTags: ${JSON.stringify(tags)}`);
    this.title.setTitle(tags.name);
    this.meta.updateTag({ name: 'description', content: tags.description });
    this.meta.updateTag({ property: 'og:description', content: tags.description });
    this.meta.updateTag({ property: 'og:title', content: tags.name });
    this.meta.updateTag({ property: 'og:image', content: tags.image });
    this.meta.updateTag({ property: 'og:image:alt', content: tags.name });

    if ( tags.imageWidth ) {
      this.meta.updateTag({ property: 'og:image:width', content: tags.imageWidth.toString() });
    }

    if ( tags.imageHeight ) {
      this.meta.updateTag({ property: 'og:image:height', content: tags.imageHeight.toString() });
    }
  }

  async updateTitle(title: string) {
    this.title.setTitle(title);
  }

  async updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc });
  }

  async updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  async updateOgUrl(url: string) {
    this.meta.updateTag({
      name: 'og:url',
      property: 'og:url',
      content: url
    });
  }

  async updateOgTitle(ogTitle: string) {
    this.meta.updateTag({
      name: 'og:title',
      property: 'og:title',
      content: ogTitle
    });
  }

  async updateOgDescription(ogDesc: string) {
    this.meta.updateTag({
      name: 'og:description',
      property: 'og:description',
      content: ogDesc
    });
  }

  async updateOgImage(ogImg: string) {
    this.meta.updateTag({
      name: 'og:image',
      property: 'og:image',
      content: ogImg
    });
  }

  async disableFollow() {
    this.meta.addTag({
      name: 'robots',
      property: 'robots',
      content: 'noindex, nofollow'
    });
  }

  async enableFollow() {
    this.meta.removeTag('robots');
  }
}

