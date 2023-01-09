import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModel } from '@cognizone/json-model';
import { ElasticSearchResponse } from '@cognizone/model-utils';
import { map, Observable, of, shareReplay } from 'rxjs';

import { ElasticState } from '../models';
import { getConfig } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  get state$(): Observable<ElasticState> {
    return this._state$
      ? this._state$
      : (this._state$ = this.http.get<ElasticState>(`${this.getBaseUrl()}/_cluster/state`).pipe(shareReplay(1)));
  }

  private _state$?: Observable<ElasticState>;

  constructor(private http: HttpClient) {}

  getIndexes(): Observable<string[]> {
    return this.state$.pipe(map(state => Object.keys(state.metadata?.indices ?? {})));
  }

  createIndex(index: string): Observable<unknown> {
    return this.http.put(`${this.getBaseUrl()}/${index}`, {
      mappings: {
        dynamic: true,
      },
    });
  }

  deleteIndex(index: string): Observable<unknown> {
    return this.http.delete(`${this.getBaseUrl()}/${index}`);
  }

  createDocuments(index: string, docs: JsonModel[]): Observable<unknown> {
    if (!docs.length) return of(null);
    const body =
      docs
        .reduce((acc, doc) => {
          acc.push({ create: { _id: btoa(encodeURIComponent(doc['@id'])) } }, doc);
          return acc;
        }, [] as unknown[])
        .map(s => JSON.stringify(s))
        .join('\n') + '\n';

    return this.http.post(`${this.getBaseUrl()}/${index}/_bulk`, body, {
      headers: {
        'Content-Type': 'application/x-ndjson',
      },
    });
  }

  createOneDoc(index: string, doc: JsonModel): Observable<unknown> {
    return this.createDocuments(index, [doc]);
  }

  // Note - Having issues with using only the ecoded uris, so using btoa for both update and delete
  updateDocument(index: string, doc: JsonModel): Observable<unknown> {
    return this.http.post(`${this.getBaseUrl()}/${index}/_update/${btoa(encodeURIComponent(doc['@id']))}`, {doc});
  }

  // Note - Having issues with using only the ecoded uris, so using btoa for both update and delete
  deleteDocument(index: string, uri: string): Observable<unknown> {
    return this.http.delete(`${this.getBaseUrl()}/${index}/_doc/${btoa(encodeURIComponent(uri))}`);
  }

  search<T>(index: string, body: {}): Observable<ElasticSearchResponse<T>> {
    return this.http.post<ElasticSearchResponse<T>>(this.getSearchUrl(index), body);
  }

  getSearchUrl(index: string): string {
    return `${this.getBaseUrl()}/${index}/_search`;
  }

  private getBaseUrl() {
    return getConfig().server.elasticProxyUrl;
  }
}
