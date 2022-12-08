import { Injectable } from '@angular/core';

import { Country } from '../models';
import { ItemService } from './item.service';

@Injectable({ providedIn: 'root' })
export class CountriesService extends ItemService<Country> {
  collectionName: string = 'countries';
}
