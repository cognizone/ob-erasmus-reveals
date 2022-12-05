import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@cognizone/i18n';
import { TranslocoModule } from '@ngneat/transloco';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

const vendors = [MatIconModule, MatMenuModule, I18nModule];

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [...vendors, CommonModule, TranslocoModule, RouterModule, MatButtonModule],
  exports: [...vendors, HeaderComponent, FooterComponent, TranslocoModule, RouterModule],
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
