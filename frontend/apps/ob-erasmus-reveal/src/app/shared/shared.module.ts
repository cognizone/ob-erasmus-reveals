import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@cognizone/i18n';
import { TranslocoModule } from '@ngneat/transloco';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { JoinNowComponent } from './components/join-now/join-now.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConnectComponent } from './components/connect/connect.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { DialogModule } from '@angular/cdk/dialog';
import { NgxEchartsModule } from 'ngx-echarts';
import { SkillsVisualizationComponent } from './components/skills-visualization/skills-visualization.component';
import { SignUpModalComponent } from './components/sign-up-modal/sign-up-modal.component';
import { AppLogoComponent } from '@app/shared-features/app-logo';

const vendors = [MatIconModule, I18nModule, NgOptimizedImage, DialogModule, CdkMenuModule];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    JoinNowComponent,
    SignupComponent,
    ConnectComponent,
    ConfirmationDialogComponent,
    SkillsVisualizationComponent,
    SignUpModalComponent,
  ],
  imports: [
    ...vendors,
    AppLogoComponent,
    CommonModule,
    TranslocoModule,
    RouterModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [
    ...vendors,
    HeaderComponent,
    FooterComponent,
    TranslocoModule,
    RouterModule,
    AboutComponent,
    JoinNowComponent,
    ConnectComponent,
    SkillsVisualizationComponent,
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
