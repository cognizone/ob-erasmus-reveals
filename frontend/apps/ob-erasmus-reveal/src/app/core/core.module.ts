import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TRANSLOCO_CONFIG, translocoConfig } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { environment } from "../../environments/environment";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslocoLocaleModule.forRoot(),
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'nl', 'fr', 'it', 'sl', 'el'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production,
      })
    },
  ]
})
export class CoreModule { }
