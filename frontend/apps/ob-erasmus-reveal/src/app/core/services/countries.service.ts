import { APP_INITIALIZER, Injectable, Provider } from '@angular/core';
import { Country } from '../models';
import { StaticItemsService } from './static-items.service';

@Injectable({ providedIn: 'root' })
export class CountriesService extends StaticItemsService<Country> {
  filePath: string = 'assets/data/countries.json';
  index: string = 'countries';
}

export function countriesInit(service: CountriesService): () => Promise<unknown> {
  return () => service.init();
}

export const countriesInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: countriesInit,
  deps: [CountriesService],
  multi: true,
};
