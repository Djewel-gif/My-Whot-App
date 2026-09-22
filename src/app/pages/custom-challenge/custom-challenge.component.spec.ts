import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomChallengeComponent } from './custom-challenge.component';

describe('CustomChallengeComponent', () => {
  let component: CustomChallengeComponent;
  let fixture: ComponentFixture<CustomChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomChallengeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
