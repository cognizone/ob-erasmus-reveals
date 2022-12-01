import { Injectable } from '@angular/core';
import { JsonModel } from '@cognizone/json-model';
import { firstValueFrom } from 'rxjs';
import { Initializer } from '../utils';
import { ItemService } from './item.service';

@Injectable()
export abstract class StaticItemsService<T extends JsonModel> extends ItemService<T> implements Initializer {
  abstract filePath: string;

  /**
   * used to populate elastic with data on load
   */
  async init(): Promise<void> {
    if (this.getState().length) return;

    const data = await firstValueFrom(this.http.get<T[]>(this.filePath));
    this.setState(data);
  }
}
