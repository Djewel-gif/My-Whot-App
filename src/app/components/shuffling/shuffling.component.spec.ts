import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShufflingComponent } from './shuffling.component';

describe('ShufflingComponent', () => {
  let component: ShufflingComponent;
  let fixture: ComponentFixture<ShufflingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShufflingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShufflingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
