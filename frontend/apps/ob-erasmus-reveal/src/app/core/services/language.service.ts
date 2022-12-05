import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { Initializer } from '../utils';

@Injectable({ providedIn: 'root' })
export class LanguageService implements Initializer {
  private readonly storageKey: string = 'app-i18n';

  constructor(private transloco: TranslocoService) {}

  async init(): Promise<void> {
    if (this.transloco.getActiveLang() !== this.state) {
      this.transloco.setActiveLang(this.state);
    }
  }

  setActiveLang(lang: string): void {
    this.transloco.setActiveLang(lang);
    this.state = lang;
  }

  private get state(): string {
    return localStorage.getItem(this.storageKey) ?? this.transloco.getDefaultLang();
  }
  private set state(lang: string) {
    localStorage.setItem(this.storageKey, lang);
  }
}
