import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { NoticeService } from '@services/notices.service';
import { INotice, Notice } from '@shared/models/notice';

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
    private noticeSrv: NoticeService,
  ) { }

  ngOnInit(): void {
    this.idNotice = this.route.snapshot.paramMap.get('id');
    if ( this.idNotice ) {
      console.log(`id asked ${this.idNotice}`);
      this.getDetails(this.idNotice);
    }
  }

  getDetails(idNotice: string): void {
    console.log(`id asked ${idNotice}`);
    this.notice$ = this.noticeSrv.getOneNotice(idNotice);
  }

  public gotoList(): void {
    this.router.navigate([`/${Notice.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${Notice.PATH_URL}/${this.idNotice}/editar`]);
  }


}
