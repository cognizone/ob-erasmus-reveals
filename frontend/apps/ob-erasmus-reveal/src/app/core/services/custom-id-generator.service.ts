import { Injectable, Provider } from '@angular/core';
import { IdGenerator } from '@cognizone/json-model';
import { Many, manyToArray } from '@cognizone/model-utils';
import { getConfig } from './config.service';

@Injectable({ providedIn: 'root' })
export class CustomIdGenerator extends IdGenerator {
  override generateId(types: Many<string>): string {
    const prefix = getConfig().baseUriForNewItems;
    types = manyToArray(types).join('-');
    return `${prefix}/${types}/${crypto.randomUUID()}`;
  }

  isNewUri(uri: string): boolean {
    return uri.startsWith(getConfig().baseUriForNewItems);
  }
}

export const customIdGeneratorProvider: Provider = {
  provide: IdGenerator,
  useExisting: CustomIdGenerator,
};
