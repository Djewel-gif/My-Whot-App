import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { Card } from '../../models/card'; 
import { Router } from '@angular/router'; 
import { GameService } from '../../services/game.service'; 
import { style } from '@angular/animations';

@Component({ 
  selector: 'app-game', 
  templateUrl: './game.component.html', 
  styleUrls: ['./game.component.css'] 
})
export class GameComponent implements OnInit, OnDestroy { 
  playerHand: Card[] = []; 
  opponentHand: Card[] = []; 
  playingCard: Card = { number: 0, symbol: '' }; 
  deck: Card[] = []; 

  gameStarted = false; 
  isShuffling = false; 
  selectedPlayer = '1'; 
  selectedStyle = 'classic'; 
  playerName = 'PLAYER ONE'; 
  selectedOpponent = 'computer'; 
  selectedDifficulty = 'standard'; 
  startingCards = 5; 
  currentTurn = 'YOUR TURN'; 
  timer = 0; 
  timerEnabled = false; 
  endDeck = false; 
  resultTitle = ''; 
  resultMessage = ''; 
  showResult = false; 
  streak = 0; 
  whotChoices = ['⬤', '▲', '✚', '■', '★']; 
  private timerInterval: any; 
  private computerTimer: any; 
  private actionTimer: any; 
  private actionShowTimer: any; 
  actionMessage = ''; 
  showActionMessage = false; 
  actionMessageKey = 0; 

  constructor(private router: Router, public gameService: GameService) {} 

  ngOnInit(): void { 
    this.loadSettings(); 
    this.loadStreak(); 
  }

  ngOnDestroy(): void { 
    this.stopTimer(); 
    this.stopComputerTimer(); 
    this.stopActionTimer(); 
  }

  private loadSettings(): void { 
    this.selectedPlayer = localStorage.getItem('selectedPlayer') || '1'; 
    this.selectedStyle = localStorage.getItem('selectedStyle') || 'classic'; 
    this.playerName = localStorage.getItem('playerName') || 'PLAYER ONE'; 
    this.selectedOpponent = localStorage.getItem('selectedOpponent') || 'computer'; 
    this.selectedDifficulty = localStorage.getItem('selectedDifficulty') || 'standard'; 

    const savedChallenge = localStorage.getItem('challengeConfig'); 

    if (this.selectedStyle === 'challenge' && savedChallenge) { 
      const config = JSON.parse(savedChallenge); 
      this.selectedOpponent = config.opponent || this.selectedOpponent; 
      this.selectedDifficulty = config.difficulty || this.selectedDifficulty; 
      this.startingCards = Number(config.startingCards) || 7; 
      this.endDeck = !!config.endDeck; 
      this.timerEnabled = !!config.timerEnabled; 
      this.timer = this.timerEnabled ? Number(config.timerMinutes || 3) * 60 : 0; 
    }

    if (this.selectedStyle === 'quick') { 
      this.timerEnabled = true; 
      this.timer = 3 * 60; 
    }

    if (this.selectedStyle === 'classic') { 
      this.timerEnabled = false; 
      this.endDeck = false; 
      this.startingCards = 5; 
    }
  }

  shuffleAndDeal(): void { 
    this.stopTimer(); 
    this.stopComputerTimer(); 
    this.stopActionTimer();
    this.showResult = false; 
    this.isShuffling = true; 
    this.currentTurn = 'YOUR TURN'; 

    setTimeout(() => { 
      this.gameService.startNewGame(this.startingCards, { 
        difficulty: this.selectedDifficulty, 
        opponent: this.selectedOpponent, 
        endDeck: this.endDeck, 
        allowRefill: !this.endDeck, 
        startingPlayer: this.selectedPlayer === '2' ? 2 : 1 
      });

      this.syncView(); 
      this.gameStarted = true; 
      this.isShuffling = false; 
      this.startTimer(); 
      if (this.gameService.currentPlayer === 2) {
        this.startNextTurn(); 
      }
    }, 2200); 
  }

  reset(): void { 
    this.stopTimer(); 
    this.stopComputerTimer(); 
    this.stopActionTimer(); 
    this.showActionMessage = false;
    this.gameService.resetGame(); 
    this.playerHand = []; 
    this.opponentHand = []; 
    this.playingCard = { number: 0, symbol: '' }; 
    this.deck = []; 
    this.gameStarted = false; 
    this.showResult = false; 
    this.currentTurn = 'READY TO PLAY'; 
  }

  isPlayable(card: Card): boolean { 
    return this.gameService.canPlay(card); 
  }

  shouldGlow(card: Card): boolean { 
    return this.selectedDifficulty === 'casual' && this.isPlayable(card) && this.gameService.currentPlayer === 1; 
  }

  playCard(card: Card): void { 
    if (this.gameService.currentPlayer !== 1 || this.gameService.whotChoicePending || this.gameService.gameOver) return;

    const played = this.gameService.playerPlayCard(card); 
    if (!played) return;

    this.showServiceAction(); 
    this.syncView();

    if (this.gameService.whotChoicePending) return; 
    this.startNextTurn();
  }

  drawCard(): void { 
    if (this.gameService.currentPlayer !== 1 || this.gameService.gameOver) return;

    const card = this.gameService.playerDrawCard(); 
    if (!card) {
      this.handleEmptyDeck();
      return;
    }

    this.syncView();
    this.startNextTurn();
  }

  chooseWhotSymbol(symbol: string): void { 
    this.gameService.choosePlayerWhotSymbol(symbol);
    this.syncView();
    this.startNextTurn();
  }

  playOpponentCard(card: Card): void { 
    if (this.selectedOpponent !== 'person') return;

    const played = this.gameService.playLocalOpponentCard(card);
    if (!played) return;

    this.showServiceAction();
    this.syncView();
    if (this.gameService.whotChoicePending) return;
    this.currentTurn = 'YOUR TURN';
  }

  chooseOpponentWhotSymbol(symbol: string): void { 
    if (this.selectedOpponent !== 'person') return;

    this.gameService.chooseLocalOpponentWhotSymbol(symbol);
    this.syncView();
    this.currentTurn = 'YOUR TURN';
  }

  private computerTurn(): void { 
    this.stopComputerTimer();
    const thinkingTime = this.getComputerThinkingTime();

    this.computerTimer = setTimeout(() => {
      if (this.gameService.gameOver || this.selectedOpponent !== 'computer') return;

      const result = this.gameService.computerTakeTurn(); 
      this.showServiceAction();

      if (this.gameService.computerChosenSymbol) {
        this.showActionIndicator('COMPUTER CHOSE: ' + this.gameService.computerChosenSymbol);
        this.gameService.computerChosenSymbol = '';
      }

      this.syncView();

      if (!result.played && !result.drawn) {
        this.handleEmptyDeck();
        return;
      }

      if (this.gameService.gameOver) {
        this.checkGameEnd();
        return;
      }

      if (this.gameService.currentPlayer === 2) {
        this.currentTurn = 'COMPUTER THINKING...';
        this.computerTurn();
        return;
      }

      this.currentTurn = 'YOUR TURN';
      this.checkGameEnd();
    }, thinkingTime);
  }

  private showServiceAction(): void { 
    if (!this.gameService.lastActionMessage) return;
    this.showActionIndicator(this.gameService.lastActionMessage);
    this.gameService.lastActionMessage = '';
  }

  private showActionIndicator(message: string): void { 
    this.stopActionTimer();
    this.showActionMessage = false;
    this.actionMessage = message;
    this.actionMessageKey++;

    this.actionShowTimer = setTimeout(() => {
      this.showActionMessage = true;
      this.actionTimer = setTimeout(() => {
        this.showActionMessage = false;
        this.actionTimer = null;
      }, 2800);
    }, 20);
  }

  private stopActionTimer(): void { 
    if (this.actionShowTimer) clearTimeout(this.actionShowTimer);
    if (this.actionTimer) clearTimeout(this.actionTimer);
    this.actionShowTimer = null;
    this.actionTimer = null;
    this.showActionMessage = false;
  }

  private getComputerThinkingTime(): number { 
    if (this.selectedDifficulty === 'casual') return 2000; 
    if (this.selectedDifficulty === 'expert') return 200; 
    return 1000; 
  }

  private stopComputerTimer(): void { 
    if (this.computerTimer) clearTimeout(this.computerTimer); 
    this.computerTimer = null; 
  }

  private startNextTurn(): void { 
    this.checkGameEnd(); 
    if (this.gameService.gameOver) return; 
    if (this.gameService.currentPlayer === 2 && this.selectedOpponent === 'computer') { 
      this.currentTurn = 'COMPUTER THINKING...'; 
      this.computerTurn(); 
      return; 
    }
    if (this.gameService.currentPlayer === 2 && this.selectedOpponent === 'person') { 
      this.currentTurn = 'PLAYER TWO TURN'; 
      return; 
    }
    this.currentTurn = 'YOUR TURN'; 
  }

  private syncView(): void { 
    this.playerHand = [...this.gameService.playerHand]; 
    this.opponentHand = [...this.gameService.opponentHand]; 
    this.playingCard = this.gameService.playingCard; 
    this.deck = [...this.gameService.deck]; 
    this.checkGameEnd(); 
    if (!this.gameService.gameOver && this.endDeck && this.deck.length === 0) { 
      this.gameService.finishByDeck(); 
      this.checkGameEnd(); 
    }
  }

  private checkGameEnd(): void { 
    if (!this.gameService.gameOver || this.showResult) return; 
    this.stopTimer(); 
    this.showResult = true; 
    if (this.gameService.winner === 1) { 
      this.resultTitle = 'YOU WIN'; 
      this.resultMessage = 'Your hand is empty. Great round!'; 
      this.streak += 1; 
      this.saveStreak(); 
    } else { 
      this.resultTitle = 'ROUND OVER'; 
      this.resultMessage = 'The opponent finished first.'; 
      this.streak = 0; 
      this.saveStreak(); 
    }
    this.saveGameAnalysis(); 
  }

  private saveGameAnalysis(): void { 
    const analysis = { 
      result: this.gameService.winner === 1 ? 'YOU WIN' : 'ROUND OVER', 
      difficulty: this.difficultyLabel, 
      mode: this.selectedStyle === 'quick' ? 'Quick Game' : this.selectedStyle === 'challenge' ? 'Custom Challenge' : 'Classic', 
      playerCardsPlayed: this.gameService.playerCardsPlayed, 
      playerCardsDrawn: this.gameService.playerCardsDrawn, 
      opponentCardsPlayed: this.gameService.opponentCardsPlayed, 
      opponentCardsDrawn: this.gameService.opponentCardsDrawn, 
      specialCardsPlayed: this.gameService.specialCardsPlayed, 
      playerHandTotal: this.gameService.getHandTotal(this.gameService.playerHand), 
      opponentHandTotal: this.gameService.getHandTotal(this.gameService.opponentHand), 
      remainingDeck: this.gameService.deck.length 
    };
    localStorage.setItem('lastGameAnalysis', JSON.stringify(analysis)); 
  }

  goToAnalysis(): void { 
    this.router.navigate(['/game-analysis']); 
  }

  changeMode(): void { 
    this.router.navigate(['/dashboard']); 
  }

  private handleEmptyDeck(): void { 
    if (this.endDeck) { 
      this.gameService.finishByDeck(); 
      this.checkGameEnd(); 
      return; 
    }
    this.currentTurn = 'YOUR TURN'; 
  }

  private startTimer(): void { 
    this.stopTimer(); 
    if (!this.timerEnabled || this.timer <= 0) return; 
    this.timerInterval = setInterval(() => { 
      if (this.gameService.gameOver) { 
        this.stopTimer(); 
        return; 
      }
      this.timer--; 
      if (this.timer <= 0) { 
        this.timer = 0; 
        this.gameService.finishByDeck(); 
        this.checkGameEnd(); 
        this.resultTitle = this.gameService.winner === 1 ? 'TIME UP — YOU WIN' : 'TIME UP — ROUND OVER'; 
        this.resultMessage = 'Time ran out. The lower hand total wins.'; 
        this.stopTimer(); 
      }
    }, 1000); 
  }

  private stopTimer(): void { 
    if (this.timerInterval) clearInterval(this.timerInterval); 
    this.timerInterval = null; 
  }

  formatTime(seconds: number): string { 
    const minutes = Math.floor(seconds / 60); 
    const remainingSeconds = seconds % 60; 
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`; 
  }

  get difficultyLabel(): string { 
    if (this.selectedDifficulty === 'casual') return 'Easy'; 
    if (this.selectedDifficulty === 'expert') return 'Expert'; 
    return 'Normal'; 
  }

  private loadStreak(): void { 
    this.streak = Number(localStorage.getItem(`whot-streak-${this.selectedDifficulty}`) || 0); 
  }

  private saveStreak(): void { 
    localStorage.setItem(`whot-streak-${this.selectedDifficulty}`, this.streak.toString()); 
  }
}
