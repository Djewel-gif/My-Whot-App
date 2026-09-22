import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAnalysisComponent } from './game-analysis.component';

describe('GameAnalysisComponent', () => {
  let component: GameAnalysisComponent;
  let fixture: ComponentFixture<GameAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
