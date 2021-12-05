import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { IEvent, Event } from '@models/event';
import { EventService } from '@services/events.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-event-resolver',
  templateUrl: './event-resolver.component.html',
  styleUrls: ['./event-resolver.component.scss']
})
export class EventResolverComponent implements OnInit {

  public urlEvent: string;
  public event: IEvent;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private eventSrv: EventService,
  ) { }

  ngOnInit(): void {
    this.urlEvent = this.route.snapshot.paramMap.get('sanitized-url');
    if ( this.urlEvent ) {
      this.getDetails(this.urlEvent);
    }
  }

  getDetails(urlEvent: string): void {
    const subs2$ = this.eventSrv.getEventByUrl(urlEvent)
      .subscribe((events: IEvent[]) => {
          console.log(`nº events: ${events.length}`);
          this.event = events[0];
          this.router.navigate([`/${Event.PATH_URL}/${this.event.id}`]);
          this.seo.generateTags({
            title: `${this.event.name} | Rincón de Soto`,
            description: this.event.description,
            image: this.event.imagePath,
          });
      });

    this.listOfObservers.push( subs2$ );
  }

  public configItem(): void {
    this.router.navigate([`/${Event.PATH_URL}/${this.event.id}/config`]);
  }

}
