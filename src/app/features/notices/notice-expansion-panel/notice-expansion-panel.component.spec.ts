import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeExpansionPanelComponent } from './notice-expansion-panel.component';

describe('NoticeExpansionPanelComponent', () => {
  let component: NoticeExpansionPanelComponent;
  let fixture: ComponentFixture<NoticeExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticeExpansionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
