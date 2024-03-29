import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

import { IAuditSocialItem } from '@models/audit-social';
import { IUser } from '@models/user';
import { Event } from '@models/event';
import { BaseType } from '@models/base';
import { AuditSocialService } from '@services/audit-social.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-events-audit-social',
  templateUrl: './events-audit-social.component.html',
  styleUrls: ['./events-audit-social.component.scss']
})
export class EventsAuditSocialComponent implements OnInit, OnDestroy {

  public auditSocialItems: IAuditSocialItem[] = [];
  private listOfObservers: Array<Subscription> = [];
  private currentUser: IUser;

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private spinnerSvc: SpinnerService,
    private auditSocialSrv: AuditSocialService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const dateMin = '2022-01-01';
    const dateMax = '2025-01-01';

      const subs2$ = this.auditSocialSrv.getAuditItemsByRange(dateMin, dateMax)

      .pipe(
        map(auditItems => auditItems.map(item => {

          item.timestamp = formatDistance(new Date(item.timestamp), new Date(), {locale: es});

          return { ...item };
        }))
      )
      .subscribe( (auditSocialItems: IAuditSocialItem[]) => {
          this.auditSocialItems = auditSocialItems;
          this.spinnerSvc.hide();
      });

      this.listOfObservers.push(subs2$);
  }

  gotoItem(item: IAuditSocialItem): void {
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
