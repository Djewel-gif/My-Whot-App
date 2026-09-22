import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedPlayer: number | null = null;
  selectedOpponent: string | null = null;
  selectedStyle: string | null = null;
  selectedDifficulty: string | null = null;

  playerName: string = '';

  constructor(private router: Router) { }

  selectPlayer(player: number): void {
    this.selectedPlayer = player;

  }

  selectOpponent(opponent: string): void {
    this.selectedOpponent = opponent;
  }

  selectStyle(style: string): void {
    this.selectedStyle = style;
  }

  selectDifficulty(difficulty: string): void {
    this.selectedDifficulty = difficulty;
  }

  startGame(): void {
    const name = this.playerName.trim();

    if (!name) {
      alert('Please enter your name.');
      return;
    }
    if (!this.selectedPlayer) {
      alert('Please choose Player 1 or Player 2.');
      return;
    }

    if (!this.selectedStyle) {
      alert('Please choose a game style.');
      return;
    }

    localStorage.setItem('playerName', name);
    localStorage.setItem('selectedPlayer', this.selectedPlayer.toString());
    localStorage.setItem('selectedStyle', this.selectedStyle);
    localStorage.setItem('selectedOpponent', this.selectedOpponent || '');
    localStorage.setItem('selectedDifficulty', this.selectedDifficulty || '');
    if (this.selectedStyle === 'challenge') {
      this.router.navigate(['/custom-challenge']);
    } else {
      this.router.navigate(['/game']);
    }
  }
}
