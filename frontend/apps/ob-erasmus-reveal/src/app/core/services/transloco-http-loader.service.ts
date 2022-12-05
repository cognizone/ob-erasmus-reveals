import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<Translation> {
    const langs$ = this.http.get<Translation>(`assets/i18n/_langs.json`);
    const main$ = this.http.get<Translation>(`assets/i18n/${lang}.json`);
    return combineLatest([main$, langs$]).pipe(map(([main, langs]) => ({ ...main, ...langs })));
  }
}
