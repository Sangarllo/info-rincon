import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { INotice, Notice } from 'src/app/core/models/notice';
import { NoticeService } from '@services/notices.service';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-notices-dashboard',
  templateUrl: './notices-dashboard.component.html'
})
export class NoticesDashboardComponent implements OnInit {

  @Input() showHeader = true;
  public notices$: Observable<INotice[]>;

  constructor(
    private router: Router,
    private utilSrv: UtilsService,
    private noticesSrv: NoticeService
  ) { }

  ngOnInit(): void {
    this.notices$ = this.noticesSrv.getAllNotices(true, true, 5)
    .pipe(
      map((notices: INotice[]) => notices.map(notice => {

        notice.timestamp = this.utilSrv.getDistanceTimestamp(notice.timestamp);

        return { ...notice };
      }))
    );
  }

  gotoNotice(notice: INotice): void {
    this.router.navigate([`/${Notice.PATH_URL}/${notice.id}`]);
  }

}
