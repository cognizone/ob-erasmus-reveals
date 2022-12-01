import { APP_INITIALIZER, Provider, Type } from '@angular/core';

export interface Initializer {
  init(): Promise<void>;
}

export function getInitializerProvider(type: Type<Initializer>): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: (service: Initializer) => () => service.init(),
    deps: [type],
    multi: true,
  };
}
