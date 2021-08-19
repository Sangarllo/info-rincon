import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWikiComponent } from './event-wiki.component';

describe('EventWikiComponent', () => {
  let component: EventWikiComponent;
  let fixture: ComponentFixture<EventWikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWikiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
