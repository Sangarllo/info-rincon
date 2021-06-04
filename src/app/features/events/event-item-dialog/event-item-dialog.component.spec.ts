import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventItemDialogComponent } from './event-item-dialog.component';

describe('EventItemDialogComponent', () => {
  let component: EventItemDialogComponent;
  let fixture: ComponentFixture<EventItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventItemDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
