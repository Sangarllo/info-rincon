import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

import { ILinkItem } from '@models/link-item';
import { IUser } from '@models/user';
import { Event } from '@models/event';
import { BaseType } from '@models/base';
import { SpinnerService } from '@services/spinner.service';
import { LinksItemService } from '@services/links-item.service';


@Component({
  selector: 'app-links-item',
  templateUrl: './links-item.component.html',
  styleUrls: ['./links-item.component.css']
})
export class LinksItemComponent implements OnInit, OnDestroy {

  public linkItems: ILinkItem[] = [];
  private listOfObservers: Array<Subscription> = [];
  private currentUser: IUser;

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private spinnerSvc: SpinnerService,
    private linksItemsSrv: LinksItemService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const dateMin = '2022-01-01';
    const dateMax = '2025-01-01';

      const subs2$ = this.linksItemsSrv.getLinksItemByRange(dateMin, dateMax)

      .pipe(
        map(linksItems => linksItems.map(item => {

          item.timestamp = formatDistance(new Date(item.timestamp), new Date(), {locale: es});

          return { ...item };
        }))
      )
      .subscribe( (linkItems: ILinkItem[]) => {
          this.linkItems = linkItems;
          this.spinnerSvc.hide();
      });

      this.listOfObservers.push(subs2$);
  }

  gotoItem(item: ILinkItem): void {
    switch ( item.itemType) {
      case BaseType.EVENT:
        this.router.navigate([Event.PATH_URL, item.itemId]);
        break;
    }
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

}
