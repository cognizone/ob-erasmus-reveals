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
      RouterModule.forRoot(
        [
          {
            path: '',
            pathMatch: 'full',
            loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
          }
        ]
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
