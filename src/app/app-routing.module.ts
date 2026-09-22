import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { HowToPlayComponent } from './pages/how-to-play/how-to-play.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomChallengeComponent } from './pages/custom-challenge/custom-challenge.component';
import { GameComponent } from './pages/game/game.component';
import { GameAnalysisComponent } from './pages/game-analysis/game-analysis.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'how-to-play', component: HowToPlayComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'custom-challenge', component: CustomChallengeComponent },
  { path: 'game', component: GameComponent },
  { path: 'game-analysis', component: GameAnalysisComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
