import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesPanelComponent } from './stories-panel.component';

describe('StoriesPanelComponent', () => {
  let component: StoriesPanelComponent;
  let fixture: ComponentFixture<StoriesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoriesPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
