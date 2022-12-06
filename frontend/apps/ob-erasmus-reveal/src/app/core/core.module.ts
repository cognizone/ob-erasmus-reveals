import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { I18nTranslocoModule } from '@cognizone/i18n-transloco';
import { DATA_MODEL_DEFINITION_HELPER_TOKEN, JsonModelService } from '@cognizone/json-model';
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { environment } from '../../environments/environment';
import { AuthService, ConfigService, CountriesService, customIdGeneratorProvider, LanguageService, TranslocoHttpLoader } from './services';
import { getInitializerProvider } from './utils';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, TranslocoLocaleModule.forRoot(), I18nTranslocoModule.forRoot()],
  providers: [
    getInitializerProvider(ConfigService),
    getInitializerProvider(AuthService),
    getInitializerProvider(CountriesService),
    getInitializerProvider(LanguageService),
    customIdGeneratorProvider,
    // we don't need the full module
    JsonModelService,
    // we don't use any data definition engine like application profile yet
    { provide: DATA_MODEL_DEFINITION_HELPER_TOKEN, useValue: null },
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'nl', 'fr', 'it', 'sl', 'el'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: environment.production,
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class CoreModule {}
