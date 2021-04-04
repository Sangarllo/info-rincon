import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILink, Link } from '@models/link';
import { LinksService } from '@services/links.services';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-links-dashboard',
  templateUrl: './links-dashboard.component.html'
})
export class LinksDashboardComponent implements OnInit {

  @Input() showHeader = true;
  public links$: Observable<ILink[]>;

  constructor(
    private router: Router,
    private utilSrv: UtilsService,
    private linksSrv: LinksService
  ) { }

  ngOnInit(): void {
    this.links$ = this.linksSrv.getAllLinks(true, true, 5)
    .pipe(
      map((links: ILink[]) => links.map(link => {

        link.timestamp = this.utilSrv.getDistanceTimestamp(link.timestamp);

        return { ...link };
      }))
    );
  }


  gotoLink(link: ILink): void {
    this.router.navigate([`/${Link.PATH_URL}/${link.id}`]);
  }
}
