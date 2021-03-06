import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityViewComponent } from './place-view.component';

describe('EntityViewComponent', () => {
  let component: EntityViewComponent;
  let fixture: ComponentFixture<EntityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
