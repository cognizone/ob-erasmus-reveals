import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@cognizone/i18n';
import { TranslocoModule } from '@ngneat/transloco';

import { AboutComponent } from './components/about/about.component';
import { JoinNowComponent } from './components/join-now/join-now.component';
import { ConnectComponent } from './components/connect/connect.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';
import { AppLogoComponent } from '@app/shared-features/app-logo';
import { SignupComponent } from '@app/shared-features/signup';

const vendors = [MatIconModule, I18nModule, NgOptimizedImage, DialogModule, CdkMenuModule];

@NgModule({
  declarations: [
    AboutComponent,
    JoinNowComponent,
    ConnectComponent
  ],
  imports: [
    ...vendors,
    AppLogoComponent,
    SignupComponent,
    CommonModule,
    TranslocoModule,
    RouterModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  exports: [
    ...vendors,
    TranslocoModule,
    RouterModule,
    AboutComponent,
    JoinNowComponent,
    ConnectComponent,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModuleRoot> {
    return {
      ngModule: SharedModuleRoot,
    };
  }
}

@NgModule({
  imports: [SharedModule],
  exports: [SharedModule],
})
export class SharedModuleRoot {
  constructor(matIconRegistry: MatIconRegistry) {
    matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
