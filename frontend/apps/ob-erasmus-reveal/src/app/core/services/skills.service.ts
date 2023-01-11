import { Injectable } from '@angular/core';
import { Skill } from '../models';
import { ItemService } from './item.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SkillsService extends ItemService<Skill> {
  collectionName: string = 'skills';

  getSkillForEndorsement(uris: string[]): Observable<Skill[]> {
    return this.getByUrisMulti(uris);
  }
}
