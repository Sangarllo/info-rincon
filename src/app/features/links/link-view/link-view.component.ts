/* eslint-disable max-len */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { environment } from '@environments/environment';
import { ILink, Link } from '@models/link';
import { LinksService } from '@services/links.services';
import { LogService } from '@services/log.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-link-view',
  templateUrl: './link-view.component.html',
  styleUrls: ['./link-view.component.scss']
})
export class LinkViewComponent implements OnInit, OnDestroy {

  public idLink: string;
  public link: ILink;
  public urlLink: string;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private logSrv: LogService,
    private linksSrv: LinksService,
  ) {
    this.matIconRegistry.addSvgIcon(
      `whatsapp`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/whatsapp.svg')
    );

    this.matIconRegistry.addSvgIcon(
      `facebook`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/facebook.svg')
    );

    this.matIconRegistry.addSvgIcon(
      `twitter`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/twitter.svg')
    );
  }

  ngOnInit(): void {
    this.idLink = this.route.snapshot.paramMap.get('id');
    if ( this.idLink ) {
      this.logSrv.info(`id asked ${this.idLink}`);
      this.getDetails(this.idLink);
    }
  }

  getDetails(idLink: string): void {
    const subs1$ = this.linksSrv.getOneLink(idLink)
      .subscribe( ( link: ILink ) => {
        this.urlLink = link.sourceUrl;
        this.link = link;
        this.seo.generateTags({
          title: `${link.name} | Enlace desde la Agenda Rinconera`,
          description: link.description,
          image: link.imagePath,
        });
      });

    this.listOfObservers.push(subs1$);
  }

  public gotoUrl(): void {
    window.open(this.urlLink, '_blank');
  }

  public gotoList(): void {
    this.router.navigate([`/${Link.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${Link.PATH_URL}/${this.idLink}/editar`]);
  }

  public shareLink(social: string) {

    const baseUrl = environment.baseUrl;
    const routerUrl = this.router.url.substring(1);
    const SHARED_URL = `${baseUrl}${routerUrl}`;

    switch ( social ) {
      case 'twitter':
        const title = `${this.link.name} | Rincón de Soto`;
        window.open('http://twitter.com/share?url='+encodeURIComponent(SHARED_URL)+'&text='+encodeURIComponent(title), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
        break;

      case 'facebook':
        window.open('http://facebook.com/sharer/sharer.php?u='+encodeURIComponent(SHARED_URL), '', 'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
        break;

      case 'whatsapp':
        window.open(`whatsapp://send?text=${SHARED_URL}`);
        break;
    }
  }
  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
