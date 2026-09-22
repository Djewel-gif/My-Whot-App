import { Injectable } from '@angular/core'; 
import { Card } from '../models/card'; 

@Injectable({ providedIn: 'root' }) 
export class GameService {
  deck: Card[] = []; 
  playerHand: Card[] = []; 
  opponentHand: Card[] = []; 
  playingCard: Card = { number: 0, symbol: '' }; 
  discardPile: Card[] = []; 
  currentPlayer: 1 | 2 = 1; 
  gameOver = false; 
  winner: 1 | 2 | 0 = 0; 
  whotChoicePending = false; 
  activeSymbol = ''; 
  selectedDifficulty = 'standard'; 
  opponentType = 'computer'; 
  allowDeckRefill = true; 
  endDeckWhenEmpty = false; 
  playerCardsPlayed = 0; 
  playerCardsDrawn = 0; 
  opponentCardsPlayed = 0; 
  opponentCardsDrawn = 0; 
  specialCardsPlayed = 0; 
  lastActionMessage = ''; 
  computerChosenSymbol = ''; 

  createDeck(): Card[] {
    
    return [
      { number: 1, symbol: '⬤' }, { number: 2, symbol: '⬤' }, { number: 3, symbol: '⬤' },
      { number: 4, symbol: '⬤' }, { number: 5, symbol: '⬤' }, { number: 7, symbol: '⬤' },
      { number: 8, symbol: '⬤' }, { number: 10, symbol: '⬤' }, { number: 11, symbol: '⬤' },
      { number: 12, symbol: '⬤' }, { number: 13, symbol: '⬤' }, { number: 14, symbol: '⬤' },
      { number: 1, symbol: '▲' }, { number: 2, symbol: '▲' }, { number: 3, symbol: '▲' },
      { number: 4, symbol: '▲' }, { number: 5, symbol: '▲' }, { number: 7, symbol: '▲' },
      { number: 8, symbol: '▲' }, { number: 10, symbol: '▲' }, { number: 11, symbol: '▲' },
      { number: 12, symbol: '▲' }, { number: 13, symbol: '▲' }, { number: 14, symbol: '▲' },
      { number: 1, symbol: '✚' }, { number: 2, symbol: '✚' }, { number: 3, symbol: '✚' },
      { number: 5, symbol: '✚' }, { number: 7, symbol: '✚' }, { number: 10, symbol: '✚' },
      { number: 11, symbol: '✚' }, { number: 13, symbol: '✚' }, { number: 14, symbol: '✚' },
      { number: 1, symbol: '■' }, { number: 2, symbol: '■' }, { number: 3, symbol: '■' },
      { number: 5, symbol: '■' }, { number: 7, symbol: '■' }, { number: 10, symbol: '■' },
      { number: 11, symbol: '■' }, { number: 13, symbol: '■' }, { number: 14, symbol: '■' },
      { number: 1, symbol: '★' }, { number: 2, symbol: '★' }, { number: 3, symbol: '★' },
      { number: 4, symbol: '★' }, { number: 5, symbol: '★' }, { number: 7, symbol: '★' },
      { number: 8, symbol: '★' },
      { number: 20, symbol: 'Whots' }, { number: 20, symbol: 'Whots' },
      { number: 20, symbol: 'Whots' }, { number: 20, symbol: 'Whots' }, { number: 20, symbol: 'Whots' }
    ];
  }

  shuffleDeck(): void {
    
    for (let i = this.deck.length - 1; i > 0; i--) {
      
      const randomIndex = Math.floor(Math.random() * (i + 1));
      
      [this.deck[i], this.deck[randomIndex]] = [this.deck[randomIndex], this.deck[i]];
    }
  }

  startNewGame(startingCards = 5, options: { difficulty?: string; opponent?: string; endDeck?: boolean; allowRefill?: boolean; startingPlayer?: 1 | 2 } = {}): void {
    
    this.deck = this.createDeck();
    
    this.playerHand = [];
    this.opponentHand = [];
    
    this.discardPile = [];
    
    this.playingCard = { number: 0, symbol: '' };
    
    this.currentPlayer = options.startingPlayer || 1;
    
    this.gameOver = false;
    
    this.winner = 0;
    
    this.whotChoicePending = false;
    
    this.activeSymbol = '';
    this.lastActionMessage = '';
    this.computerChosenSymbol = '';
    
    this.playerCardsPlayed = 0;
    this.playerCardsDrawn = 0;
    this.opponentCardsPlayed = 0;
    this.opponentCardsDrawn = 0;
    this.specialCardsPlayed = 0;
    
    this.selectedDifficulty = options.difficulty || 'standard';
    
    this.opponentType = options.opponent || 'computer';
    
    this.endDeckWhenEmpty = options.endDeck || false;
    
    this.allowDeckRefill = options.allowRefill !== false;

    
    this.shuffleDeck();

    
    for (let i = 0; i < startingCards; i++) {
      
      this.playerHand.push(this.deck.pop()!);
      
      this.opponentHand.push(this.deck.pop()!);
    }

    
    let firstCard = this.deck.pop();

    
    while (firstCard && firstCard.number === 20) {
      
      this.deck.unshift(firstCard);
      
      this.shuffleDeck();
      
      firstCard = this.deck.pop();
    }

    
    if (firstCard) {
      this.playingCard = firstCard;
      
      this.discardPile = [firstCard];
    }
  }

  resetGame(): void {
    
    this.deck = [];
    
    this.playerHand = [];
    
    this.opponentHand = [];
    
    this.discardPile = [];
    
    this.playingCard = { number: 0, symbol: '' };
    
    this.currentPlayer = 1;
    
    this.gameOver = false;
    
    this.winner = 0;
    
    this.whotChoicePending = false;
    this.activeSymbol = '';
    this.playerCardsPlayed = 0; 
    this.playerCardsDrawn = 0; 
    this.opponentCardsPlayed = 0; 
    this.opponentCardsDrawn = 0; 
    this.specialCardsPlayed = 0; 
    this.lastActionMessage = ''; 
    this.computerChosenSymbol = ''; 
  }

  canPlay(card: Card): boolean {
    
    if (card.number === 20) return true;
    
    if (this.activeSymbol && card.symbol === this.activeSymbol) return true;
    
    if (card.number === this.playingCard.number) return true;
    
    if (card.symbol === this.playingCard.symbol) return true;
    
    return false;
  }

  drawCard(allowRefill = true): Card | null {
    
    if (this.deck.length === 0 && allowRefill && this.allowDeckRefill) this.refillDeck();
    
    if (this.deck.length === 0) return null;
    
    return this.deck.pop()!;
  }

  refillDeck(): void {
    
    if (this.discardPile.length === 0) return;
    
    this.deck = [...this.discardPile];
    
    this.discardPile = [];
    
    this.shuffleDeck();
  }

  
  playerPlayCard(card: Card): boolean {
    return this.playCard(card);
  }

  playerDrawCard(): Card | null {
    if (this.currentPlayer !== 1 || this.gameOver) return null;
    const card = this.drawCard(true);
    if (!card) return null;
    this.playerHand.push(card);
    this.playerCardsDrawn++;
    this.currentPlayer = 2;
    return card;
  }

  choosePlayerWhotSymbol(symbol: string): void {
    if (this.currentPlayer !== 1) return;
    this.chooseWhotSymbol(symbol);
  }

  playLocalOpponentCard(card: Card): boolean {
    return this.playOpponentCard(card);
  }

  chooseLocalOpponentWhotSymbol(symbol: string): void {
    if (!this.whotChoicePending || this.gameOver) return;
    this.activeSymbol = symbol;
    this.whotChoicePending = false;
    this.currentPlayer = 1;
  }

  computerTakeTurn(): { played: boolean; drawn: boolean; card: Card | null } {
    const played = this.computerPlay();
    if (played) return { played: true, drawn: false, card: null };

    const card = this.computerDrawCard();
    if (!card) return { played: false, drawn: false, card: null };

    this.currentPlayer = 1;
    return { played: false, drawn: true, card };
  }

  playCard(card: Card): boolean {
    
    if (this.currentPlayer !== 1 || this.gameOver) return false;
    
    if (!this.canPlay(card)) return false;
    
    const cardIndex = this.playerHand.indexOf(card);
    
    if (cardIndex === -1) return false;
    
    this.playerHand.splice(cardIndex, 1);
    
    this.discardPile.push(this.playingCard);
    
    this.playingCard = card;
    this.playerCardsPlayed++; 
    if ([1, 2, 5, 8, 14, 20].includes(card.number)) this.specialCardsPlayed++; 
    
    if (this.playerHand.length === 0) {
      this.finishGame(1);
      return true;
    }
    
    if (card.number === 20) {
      this.lastActionMessage = 'WHOT';
      this.whotChoicePending = true;
      this.currentPlayer = 1;
      return true;
    }
    
    this.applySpecialForPlayer(card);
    return true;
  }

  chooseWhotSymbol(symbol: string): void {
    
    if (!this.whotChoicePending || this.gameOver) return;
    
    this.activeSymbol = symbol;
    
    this.whotChoicePending = false;
    
    this.currentPlayer = 2;
  }

  computerPlay(): boolean {
    
    if (this.currentPlayer !== 2 || this.gameOver) return false;
    
    const playable = this.opponentHand.filter(card => this.canPlay(card));
    
    if (playable.length === 0) return false;
    
    const card = this.chooseComputerCard(playable);
    
    const cardIndex = this.opponentHand.indexOf(card);
    
    this.opponentHand.splice(cardIndex, 1);
    
    this.discardPile.push(this.playingCard);
    
    this.playingCard = card;
    this.opponentCardsPlayed++; 
    
    if (this.opponentHand.length === 0) {
      this.finishGame(2);
      return true;
    }
    
    if (card.number === 20) {
      this.activeSymbol = this.bestComputerSymbol();
      this.computerChosenSymbol = this.activeSymbol;
      this.lastActionMessage = 'WHOT';
      this.currentPlayer = 1;
      return true;
    }
    
    this.applySpecialForComputer(card);
    return true;
  }

  computerDrawCard(): Card | null {
    
    const card = this.drawCard(true);
    
    if (!card) return null;
    
    this.opponentHand.push(card);
    this.opponentCardsDrawn++; 
    
    return card;
  }

  playOpponentCard(card: Card): boolean {
    
    if (this.currentPlayer !== 2 || this.gameOver) return false;
    
    if (!this.canPlay(card)) return false;
    
    const cardIndex = this.opponentHand.indexOf(card);
    
    if (cardIndex === -1) return false;
    
    this.opponentHand.splice(cardIndex, 1);
    
    this.discardPile.push(this.playingCard);
    
    this.playingCard = card;
    
    if (this.opponentHand.length === 0) {
      this.finishGame(2);
      return true;
    }
    
    if (card.number === 20) {
      this.lastActionMessage = 'WHOT';
      this.whotChoicePending = true;
      return true;
    }
    
    this.applySpecialForComputer(card);
    return true;
  }

  private chooseComputerCard(cards: Card[]): Card {
    
    if (this.selectedDifficulty === 'casual') return cards[0];

    
    if (this.selectedDifficulty === 'standard') {
      const sameNumber = cards.find(card => card.number === this.playingCard.number);
      
      return sameNumber || cards[0];
    }

    
    let bestCard = cards[0];
    let bestScore = -Infinity;

    
    cards.forEach(card => {
      
      let score = 0;

      
      if (this.opponentHand.length === 1) score += 1000;

      
      if (card.number === 2) score += 25;
      if (card.number === 5) score += 30;
      if (card.number === 8) score += 18;
      if (card.number === 14) score += 22;
      if (card.number === 1) score += 15;

      
      if (card.number === 20) score += 35;

      
      if (card.number !== 20) score += this.countOwnSymbol(card.symbol) * 4;

      
      score += Math.max(0, 20 - card.number);

      
      if (score > bestScore) {
        bestScore = score;
        bestCard = card;
      }
    });

    
    return bestCard;
  }

  private countOwnSymbol(symbol: string): number {
    
    return this.opponentHand.filter(card => card.symbol === symbol && card.number !== 20).length;
  }

  private bestComputerSymbol(): string {
    
    const counts: { [symbol: string]: number } = {};
    
    this.opponentHand.forEach(card => {
      
      if (card.number !== 20) counts[card.symbol] = (counts[card.symbol] || 0) + 1;
    });
    
    let best = Object.keys(counts)[0] || '⬤';
    
    Object.keys(counts).forEach(symbol => {
      
      if (counts[symbol] > counts[best]) best = symbol;
    });
    
    return best;
  }

  private applySpecialForPlayer(card: Card): void {
    this.lastActionMessage = '';
    this.activeSymbol = '';
    
    if (card.number === 1 || card.number === 8) {
      this.lastActionMessage = card.number === 1 ? 'HOLD' : 'SUSPENSION';
      this.currentPlayer = 1;
      return;
    }
    
    if (card.number === 2) {
      if(this.selectedDifficulty === 'casual'){
        this.lastActionMessage = 'PICK 2';
      }
      this.drawForOpponent(2);
      this.currentPlayer = 1;
      return;
    }
    
    if (card.number === 5) {
       if(this.selectedDifficulty === 'casual'){
        this.lastActionMessage = 'PICK 3';
      }
      this.drawForOpponent(3);
      this.currentPlayer = 1;
      return;
    }
    
    if (card.number === 14) {
       if(this.selectedDifficulty === 'casual'){
       this.lastActionMessage = 'GO GEN';
      }
      this.drawForOpponent(1);
      this.currentPlayer = 1;
      return;
    }
    
    this.currentPlayer = 2;
  }

  private applySpecialForComputer(card: Card): void {
    this.lastActionMessage = '';
    this.activeSymbol = '';
    
    if (card.number === 1 || card.number === 8) {
      this.lastActionMessage = card.number === 1 ? 'HOLD' : 'SUSPENSION';
      this.currentPlayer = 2;
      return;
    }
    
    if (card.number === 2) {
     if(this.selectedDifficulty === 'casual'){
        this.lastActionMessage = 'PICK 2';
      }
      this.drawForPlayer(2);
      this.currentPlayer = 2;
      return;
    }
    
    if (card.number === 5) {
        if(this.selectedDifficulty === 'casual'){
        this.lastActionMessage = 'PICK 3';
      }
      this.drawForPlayer(3);
      this.currentPlayer = 2;
      return;
    }
    
    if (card.number === 14) {
        if(this.selectedDifficulty === 'casual'){
       this.lastActionMessage = 'GO GEN';
      }
      this.drawForPlayer(1);
      this.currentPlayer = 2;
      return;
    }
    
    this.currentPlayer = 1;
  }

  private drawForPlayer(amount: number): void {
    
    for (let i = 0; i < amount; i++) {
      
      const card = this.drawCard(true);
      if (!card) break;
      
      this.playerHand.push(card);
      this.playerCardsDrawn++; 
    }
  }

  private drawForOpponent(amount: number): void {
    
    for (let i = 0; i < amount; i++) {
      
      const card = this.drawCard(true);
      if (!card) break;
      
      this.opponentHand.push(card);
      this.opponentCardsDrawn++; 
    }
  }

  finishGame(winner: 1 | 2): void {
    
    this.gameOver = true;
    
    this.winner = winner;
    
    this.whotChoicePending = false;
  }

  finishByDeck(): void {
    
    if (this.gameOver) return;
    
    const playerTotal = this.getHandTotal(this.playerHand);
    const opponentTotal = this.getHandTotal(this.opponentHand);
    
    this.winner = playerTotal <= opponentTotal ? 1 : 2;
    
    this.gameOver = true;
  }

  getHandTotal(hand: Card[]): number {
    
    return hand.reduce((total, card) => total + card.number, 0);
  }
}
