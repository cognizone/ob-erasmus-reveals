import { Injectable } from '@angular/core';
import { JsonModel } from '@cognizone/json-model';

@Injectable({ providedIn: 'root' })
export class EncodeUriService {
  encode(uri: JsonModel | string): string {
    uri = typeof uri === 'string' ? uri : uri['@id'];
    return btoa(uri);
  }

  decode(value: string): string {
    return atob(value);
  }
}
