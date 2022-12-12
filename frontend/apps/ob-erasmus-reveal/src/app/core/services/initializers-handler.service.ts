import { APP_INITIALIZER, Inject, Injectable, InjectionToken, Optional, Provider, Type } from '@angular/core';
import { ConfigService } from './config.service';

export const INITIALIZER_TOKEN = new InjectionToken('Initializer');

@Injectable({ providedIn: 'root' })
export class InitializersHandlerService implements Initializer {
  constructor(private configService: ConfigService, @Optional() @Inject(INITIALIZER_TOKEN) private initializers?: Initializer[]) {}

  /**
   * making sure that ConfigService is initialized before anything else so that
   * `getConfig()` can be called wherever without having to think about timings
   */
  async init(): Promise<void> {
    await this.configService.init();
    await Promise.all(this.initializers?.map(initializer => initializer.init()) ?? []);
  }
}

export interface Initializer {
  init(): Promise<void>;
}

export function provideInitializer(type: Type<Initializer>): Provider {
  return {
    provide: INITIALIZER_TOKEN,
    useExisting: type,
    multi: true,
  };
}

export function provideAppInitializer(type: Type<Initializer>): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: (service: Initializer) => () => service.init(),
    deps: [type],
    multi: true,
  };
}
