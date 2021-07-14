import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";

import { MatIconRegistry } from "@angular/material/icon";
import { Observable, Subscription } from 'rxjs';

import { environment } from '@environments/environment';
import { INotice, Notice } from '@models/notice';
import { NoticeService } from '@services/notices.service';
import { LogService } from '@services/log.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-notice-view',
  templateUrl: './notice-view.component.html',
  styleUrls: ['./notice-view.component.scss']
})
export class NoticeViewComponent implements OnInit, OnDestroy {

  private listOfObservers: Array<Subscription> = [];
  public idNotice: string;
  public notice: INotice;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private logSrv: LogService,
    private noticeSrv: NoticeService,
    ) {
      this.matIconRegistry.addSvgIcon(
        `whatsapp`,
        this.domSanitizer.bypassSecurityTrustResourceUrl("../../../../assets/svg/whatsapp.svg")
      );

      this.matIconRegistry.addSvgIcon(
        `facebook`,
        this.domSanitizer.bypassSecurityTrustResourceUrl("../../../../assets/svg/facebook.svg")
      );

      this.matIconRegistry.addSvgIcon(
        `twitter`,
        this.domSanitizer.bypassSecurityTrustResourceUrl("../../../../assets/svg/twitter.svg")
      );
    }

  ngOnInit(): void {
    this.idNotice = this.route.snapshot.paramMap.get('id');
    if ( this.idNotice ) {
      this.logSrv.info(`id asked ${this.idNotice}`);
      this.getDetails(this.idNotice);
    }
  }

  getDetails(idNotice: string): void {
    this.logSrv.info(`id asked ${idNotice}`);
    const subs1$ = this.noticeSrv.getOneNotice(idNotice)
      .subscribe((notice: INotice) => {
        this.notice = notice;
        this.seo.generateTags({
          title: `${notice.name} | Rincón de Soto`,
          description: notice.description,
          image: notice.image,
        });
      });

    this.listOfObservers.push(subs1$);
  }

  public gotoList(): void {
    this.router.navigate([`/${Notice.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${Notice.PATH_URL}/${this.idNotice}/editar`]);
  }

  public shareLink(social: string) {

    const baseUrl = environment.baseUrl;
    const routerUrl = this.router.url.substring(1);
    const SHARED_URL = `${baseUrl}${routerUrl}`;

    switch ( social ) {
      case 'twitter':
        const title = `${this.notice.name} | Rincón de Soto`;
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
