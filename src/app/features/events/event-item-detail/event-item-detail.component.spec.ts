import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventItemDetailComponent } from './event-item-detail.component';

describe('EventItemDetailComponent', () => {
  let component: EventItemDetailComponent;
  let fixture: ComponentFixture<EventItemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventItemDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
