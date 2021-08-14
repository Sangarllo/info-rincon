import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '@environments/environment';
import { AngularFireModule } from '@angular/fire';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@shared/material/material.module';

import { EventItemDetailComponent } from './event-item-detail.component';

describe('EventItemDetailComponent', () => {
  let component: EventItemDetailComponent;
  let fixture: ComponentFixture<EventItemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        RouterTestingModule,
        MaterialModule,
      ],
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
