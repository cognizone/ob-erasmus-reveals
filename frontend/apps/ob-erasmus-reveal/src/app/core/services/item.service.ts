import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModel, JsonModelService } from '@cognizone/json-model';
import produce, { Draft } from 'immer';
import { firstValueFrom, Observable } from 'rxjs';
import { DataFile } from '../models';

import { randomDelay } from '../utils';
import { ConfigService, getConfig } from './config.service';
import { CustomIdGenerator } from './custom-id-generator.service';
import { Initializer } from './initializers-handler.service';

@Injectable()
export abstract class ItemService<T extends JsonModel> implements Initializer {
  abstract collectionName: string;

  constructor(
    protected http: HttpClient,
    protected jsonModelService: JsonModelService,
    protected idGenerator: CustomIdGenerator,
    protected configService: ConfigService
  ) {}

  async init(): Promise<void> {
    if (!this.needDataInit()) return;

    const { data } = await firstValueFrom(this.http.get<DataFile<T>>(`assets/data/${this.collectionName}.json`));
    this.setState(data);
  }

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

  delete(uri: string): Observable<unknown> {
    const newState = produce(this.getState(), draft => {
      const currentIndex = draft.findIndex(i => i['@id'] === uri);
      if (currentIndex > -1) {
        draft.splice(currentIndex, 1);
      }
    });

    this.setState(newState);
    return randomDelay(null);
  }

  getByUri(uri: string): Observable<T> {
    const item = this.getState().find(i => i['@id'] === uri);
    return randomDelay(item!);
  }

  // TODO cache it once fetching trough http
  getAll(): Observable<T[]> {
    return randomDelay(this.getState());
  }

  protected getStorageKey(): string {
    return `${this.getBaseStorageKey()}-${this.getVersion()}`;
  }

  protected getBaseStorageKey(): string {
    return `fake-elastic-index-${this.collectionName}`;
  }

  protected getState(): T[] {
    const value = localStorage.getItem(this.getStorageKey());
    return value ? JSON.parse(value) : [];
  }

  protected setState(items: T[]): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
  }

  protected getVersion(): number {
    return getConfig().dataVersions[this.collectionName];
  }

  private needDataInit(): boolean {
    if (localStorage.getItem(this.getStorageKey()) != null) return false;
    for (let i = 0; i < localStorage.length; ++i) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.getBaseStorageKey())) {
        localStorage.removeItem(key);
      }
    }

    return true;
  }
}
