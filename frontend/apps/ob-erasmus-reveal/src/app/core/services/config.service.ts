import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, firstValueFrom, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { BaseConfig, Config, ServerConfig } from '../models';
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
  config$: Observable<Config> = combineLatest([this.getBaseConfig(), this.getServerConfig()]).pipe(
    map(([baseConfig, serverConfig]) => {
      const fullConfig = { ...baseConfig, server: serverConfig };
      this.config = fullConfig;
      config = fullConfig;

      return fullConfig;
    }),
    shareReplay(1)
  );

  config!: Config;

  constructor(private http: HttpClient) {}

  async init(): Promise<void> {
    await firstValueFrom(this.config$);
  }

  private getBaseConfig(): Observable<BaseConfig> {
    return this.http.get<Config>('assets/config.json');
  }

  private getServerConfig(): Observable<ServerConfig> {
    return this.http.get<ServerConfig>('api/settings');
  }
}
