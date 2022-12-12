import { Injectable } from '@angular/core';
import { Skill } from '../models';
import { ItemService } from './item.service';

@Injectable({ providedIn: 'root' })
export class SkillsService extends ItemService<Skill> {
  collectionName: string = 'skills';
}
