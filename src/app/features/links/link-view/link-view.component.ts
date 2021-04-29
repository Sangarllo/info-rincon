import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ILink, Link } from 'src/app/core/models/link';
import { LinksService } from '@services/links.services';
import { LogService } from '@services/log.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-link-view',
  templateUrl: './link-view.component.html',
  styleUrls: ['./link-view.component.scss']
})
export class LinkViewComponent implements OnInit {

  public idLink: string;
  public link: ILink;
  public urlLink: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private logSrv: LogService,
    private linksSrv: LinksService,
  ) { }

  ngOnInit(): void {
    this.idLink = this.route.snapshot.paramMap.get('id');
    if ( this.idLink ) {
      this.logSrv.info(`id asked ${this.idLink}`);
      this.getDetails(this.idLink);
    }
  }

  getDetails(idLink: string): void {
    this.linksSrv.getOneLink(idLink)
      .subscribe( ( link: ILink ) => {
        this.urlLink = link.sourceUrl;
        this.link = link;
        this.seo.generateTags({
          title: `${link.name} | ${link.source}`,
          description: link.description,
          image: link.image,
        });
      });
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
}
