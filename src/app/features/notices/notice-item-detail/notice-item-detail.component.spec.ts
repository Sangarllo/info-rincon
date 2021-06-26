import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeItemDetailComponent } from './notice-item-detail.component';

describe('NoticeItemDetailComponent', () => {
  let component: NoticeItemDetailComponent;
  let fixture: ComponentFixture<NoticeItemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticeItemDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
