import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '@environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@shared/material/material.module';

import { EventCreationComponent } from './event-creation.component';

describe('EventCreationComponent', () => {
  let component: EventCreationComponent;
  let fixture: ComponentFixture<EventCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        RouterTestingModule,
        MaterialModule,
      ],
      declarations: [ EventCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
