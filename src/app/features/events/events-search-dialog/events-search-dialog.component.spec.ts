import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSearchDialogComponent } from './events-search-dialog.component';

describe('EventsSearchDialogComponent', () => {
  let component: EventsSearchDialogComponent;
  let fixture: ComponentFixture<EventsSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsSearchDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
