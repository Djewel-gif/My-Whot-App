import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({ selector: 'app-custom-challenge', templateUrl: './custom-challenge.component.html', styleUrls: ['./custom-challenge.component.css'] })
export class CustomChallengeComponent {
  playerName = localStorage.getItem('playerName') || 'Player One';
  opponent = localStorage.getItem('selectedOpponent') || 'computer';
 difficulty = localStorage.getItem('selectedDifficulty') || 'standard';
  startingCards = 7;
  endDeck = false;
  timerEnabled = true;
  timerMinutes = 5;

  constructor(private router: Router) {}
  choose(key: 'opponent'|'difficulty', value: string): void { this[key] = value as never; }
  startChallenge(): void {
    localStorage.setItem('challengeConfig', JSON.stringify({ opponent: this.opponent, difficulty: this.difficulty, startingCards: this.startingCards, endDeck: this.endDeck, timerEnabled: this.timerEnabled, timerMinutes: this.timerMinutes }));
    localStorage.setItem('selectedStyle', 'challenge');
    this.router.navigate(['/game']);
  }
}
