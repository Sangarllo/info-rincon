import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { INotice, Notice } from '@models/notice';
import { NoticeService } from '@services/notices.service';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-notice-view',
  templateUrl: './notice-view.component.html',
  styleUrls: ['./notice-view.component.scss']
})
export class NoticeViewComponent implements OnInit {

  public notice$: Observable<INotice | undefined> | null = null;
  public idNotice: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logSrv: LogService,
    private noticeSrv: NoticeService,
  ) { }

  ngOnInit(): void {
    this.idNotice = this.route.snapshot.paramMap.get('id');
    if ( this.idNotice ) {
      this.logSrv.info(`id asked ${this.idNotice}`);
      this.getDetails(this.idNotice);
    }
  }

  getDetails(idNotice: string): void {
    this.logSrv.info(`id asked ${idNotice}`);
    this.notice$ = this.noticeSrv.getOneNotice(idNotice);
  }

  public gotoList(): void {
    this.router.navigate([`/${Notice.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${Notice.PATH_URL}/${this.idNotice}/editar`]);
  }


}
