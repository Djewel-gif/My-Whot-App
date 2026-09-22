import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HowToPlayComponent } from './pages/how-to-play/how-to-play.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomChallengeComponent } from './pages/custom-challenge/custom-challenge.component';
import { GameComponent } from './pages/game/game.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FloatingCardsComponent } from './components/floating-cards/floating-cards.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardComponent } from './components/card/card.component';
import { ShufflingComponent } from './components/shuffling/shuffling.component';
import { GameAnalysisComponent } from './pages/game-analysis/game-analysis.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HowToPlayComponent,
    DashboardComponent,
    CustomChallengeComponent,
    GameComponent,
    NavbarComponent,
    FloatingCardsComponent,
    TutorialComponent,
    FooterComponent,
    CardComponent,
    ShufflingComponent,
    GameAnalysisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
