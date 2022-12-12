import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

import { Config } from '../models';
import { Initializer } from './initializers-handler.service';

let config: Config;

export function getConfig(): Config {
  if (!config) {
    throw new Error('Cannot get config before initialization phase occurred');
  }
  return config;
}

@Injectable({ providedIn: 'root' })
export class ConfigService implements Initializer {
  config$: Observable<Config> = this.getConfig().pipe(
    tap(c => {
      this.config = c;
      config = c;
    }),
    shareReplay(1)
  );

  config!: Config;

  constructor(private http: HttpClient) {}

  async init(): Promise<void> {
    await firstValueFrom(this.config$);
  }

  private getConfig(): Observable<Config> {
    return this.http.get<Config>('assets/config.json');
  }
}
