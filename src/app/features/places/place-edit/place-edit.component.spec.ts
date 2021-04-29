import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityEditComponent } from './place-edit.component';

describe('EntityEditComponent', () => {
  let component: EntityEditComponent;
  let fixture: ComponentFixture<EntityEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
