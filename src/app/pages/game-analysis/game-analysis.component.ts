import { Component } from '@angular/core'; 
import { Router } from '@angular/router'; 

interface GameAnalysis { 
  result: string; 
  difficulty: string; 
  mode: string; 
  playerCardsPlayed: number; 
  playerCardsDrawn: number; 
  opponentCardsPlayed: number; 
  opponentCardsDrawn: number; 
  specialCardsPlayed: number; 
  playerHandTotal: number; 
  opponentHandTotal: number; 
  remainingDeck: number; 
}

@Component({ 
  selector: 'app-game-analysis', 
  templateUrl: './game-analysis.component.html', 
  styleUrls: ['./game-analysis.component.css'] 
})
export class GameAnalysisComponent { 
  analysis: GameAnalysis; 

  constructor(private router: Router) { 
    this.analysis = this.loadAnalysis(); 
  }

  private loadAnalysis(): GameAnalysis { 
    const saved = localStorage.getItem('lastGameAnalysis'); 

    if (saved) { 
      return JSON.parse(saved) as GameAnalysis; 
    }

    return { 
      result: 'NO GAME YET', 
      difficulty: 'Normal', 
      mode: 'Classic', 
      playerCardsPlayed: 0, 
      playerCardsDrawn: 0, 
      opponentCardsPlayed: 0, 
      opponentCardsDrawn: 0, 
      specialCardsPlayed: 0, 
      playerHandTotal: 0, 
      opponentHandTotal: 0, 
      remainingDeck: 0 
    };
  }

  goToGame(): void { 
    this.router.navigate(['/game']); 
  }

  changeMode(): void { 
    this.router.navigate(['/dashboard']); 
  }
}
