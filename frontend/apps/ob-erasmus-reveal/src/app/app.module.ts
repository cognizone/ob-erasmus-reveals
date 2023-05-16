import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { ProfileAuthGuard } from './core/guards';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
        canActivate: [ProfileAuthGuard],
      },
      {
        path: 'signup',
        loadChildren: () => import('./features/get-started/get-started.module').then(m => m.GetStartedModule),
        canActivate: [ProfileAuthGuard],
      },
      {
        path: 'login',
        loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule),
        canActivate: [ProfileAuthGuard],
      },
      {
        path: 'complete-profile',
        loadChildren: () => import('./features/complete-profile/complete-profile.module').then(m => m.CompleteProfileModule),
      },
      {
        path: 'global-skills',
        loadChildren: () =>
          import('./features/global-skills-visualization/global-skills-visualization.module').then(m => m.GlobalSkillsVisualizationModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'feedback-request',
        loadChildren: () => import('./features/feedback-request/feedback-request.module').then(m => m.FeedbackRequestModule),
      },
      {
        path: 'endorse-skills',
        loadChildren: () => import('./features/endorse-skills/endorse-skills.module').then(m => m.EndorseSkillsModule),
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
