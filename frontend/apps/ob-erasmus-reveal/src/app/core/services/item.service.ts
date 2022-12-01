import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModel, JsonModelService } from '@cognizone/json-model';
import produce, { Draft } from 'immer';
import { Observable } from 'rxjs';

import { randomDelay } from '../utils';
import { getConfig } from './config.service';
import { CustomIdGenerator } from './custom-id-generator.service';

@Injectable()
export abstract class ItemService<T extends JsonModel> {
  abstract index: string;

  constructor(protected http: HttpClient, protected jsonModelService: JsonModelService, protected idGenerator: CustomIdGenerator) {}

  save(item: T): Observable<string> {
    if (this.idGenerator.isNewUri(item['@id'])) {
      item = produce(item, draft => {
        draft['@id'] = draft['@id'].replace(getConfig().baseUriForNewItems, getConfig().baseUri);
      });
    }

    const newState = produce(this.getState(), draft => {
      const currentIndex = draft.findIndex(i => i['@id'] === item['@id']);
      if (currentIndex > -1) {
        draft.splice(currentIndex, 1);
      }
      draft.unshift(item as Draft<T>);
    });
    this.setState(newState);

    return randomDelay(item['@id']);
  }

  getByUri(uri: string): Observable<T | undefined> {
    const item = this.getState().find(i => i['@id'] === uri);
    return randomDelay(item);
  }

  protected getStorageKey(): string {
    return `fake-elastic-index-${this.index}`;
  }

  protected getState(): T[] {
    const value = localStorage.getItem(this.getStorageKey());
    return value ? JSON.parse(value) : [];
  }

  protected setState(items: T[]): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
  }
}
