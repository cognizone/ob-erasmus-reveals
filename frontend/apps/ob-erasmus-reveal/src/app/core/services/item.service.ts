import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModel, JsonModelService } from '@cognizone/json-model';
import { extractOneSourceFromElasticResponse, extractSourcesFromElasticResponse } from '@cognizone/model-utils';
import { environment } from 'apps/ob-erasmus-reveal/src/environments/environment';
import produce from 'immer';
import { firstValueFrom, map, Observable, shareReplay } from 'rxjs';

import { DataFile } from '../models';
import { ConfigService, getConfig } from './config.service';
import { CustomIdGenerator } from './custom-id-generator.service';
import { ElasticService } from './elastic.service';
import { Initializer } from './initializers-handler.service';

@Injectable()
export abstract class ItemService<T extends JsonModel> implements Initializer {
  abstract collectionName: string;

  private all$?: Observable<T[]>;
  private readonly INDEX_PREFIX: string = environment.production ? '' : 'local-';

  constructor(
    protected http: HttpClient,
    protected jsonModelService: JsonModelService,
    protected idGenerator: CustomIdGenerator,
    protected configService: ConfigService,
    protected elasticService: ElasticService
  ) {}

  async init(): Promise<void> {
    if (!(await this.needDataInit())) return;

    const { data } = await firstValueFrom(this.http.get<DataFile<T>>(`assets/data/${this.collectionName}.json`));
    await this.initializeIndex(data);
  }

  save(item: T): Observable<string> {
    if (this.idGenerator.isNewUri(item['@id'])) {
      item = produce(item, draft => {
        draft['@id'] = draft['@id'].replace(getConfig().baseUriForNewItems, getConfig().baseUri);
      });
      return this.elasticService.createOneDoc(this.getIndex(), item).pipe(map(() => item['@id']));
    }
    return this.elasticService.updateDocument(this.getIndex(), item).pipe(map(() => item['@id']));
  }

  delete(uri: string): Observable<unknown> {
    return this.elasticService.deleteDocument(this.getIndex(), uri);
  }

  getByUri(uri: string): Observable<T> {
    return this.elasticService
      .search<T>(this.getIndex(), {
        size: 1,
        query: {
          bool: {
            filter: {
              term: {
                '@id.keyword': uri,
              },
            },
          },
        },
      })
      .pipe(map(extractOneSourceFromElasticResponse));
  }

  getAll(): Observable<T[]> {
    if (this.all$) return this.all$;
    return (this.all$ = this.elasticService
      .search<T>(this.getIndex(), {
        size: 10_000,
      })
      .pipe(map(extractSourcesFromElasticResponse), shareReplay(1)));
  }

  protected getIndex(): string {
    return `${this.INDEX_PREFIX}data-${this.collectionName}-v${this.getVersion()}`;
  }

  protected getIndexWithoutVersion(index: string): string {
    return index.replace(/-v\d+$/, '');
  }

  protected async initializeIndex(items: T[]): Promise<void> {
    await firstValueFrom(this.elasticService.createIndex(this.getIndex()));
    await firstValueFrom(this.elasticService.createDocuments(this.getIndex(), items));
  }

  protected getVersion(): number {
    return getConfig().dataVersions[this.collectionName];
  }

  private async needDataInit(): Promise<boolean> {
    const indexes = await firstValueFrom(this.elasticService.getIndexes());
    const myIndex = this.getIndex();
    if (indexes.includes(myIndex)) return false;

    for (const index of indexes) {
      if (this.getIndexWithoutVersion(index) === this.getIndexWithoutVersion(myIndex)) {
        await firstValueFrom(this.elasticService.deleteIndex(index));
      }
    }

    return true;
  }
}
