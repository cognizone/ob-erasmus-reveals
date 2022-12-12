import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';

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
      },
      {
        path: 'signup',
        loadChildren: () => import('./features/get-started/get-started.module').then(m => m.GetStartedModule),
      },
      {
        path: 'login',
        loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule),
      },
      {
        path: 'complete-profile',
        loadChildren: () => import('./features/complete-profile/complete-profile.module').then(m => m.CompleteProfileModule),
      }, // TODO - remove me after email template is ready.
      {
        path: 'global-skills',
        loadChildren: () => import('./features/global-skills-visualization/global-skills-visualization.module').then(m => m.GlobalSkillsVisualizationModule),
      },
      {
        path: 'feedback-request',
        loadChildren: () => import('./features/feedback-request/feedback-request.module').then(m => m.FeedbackRequestModule),
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
