import { Injectable } from '@angular/core';
import { RelationshipType, Skill } from '../models';
import { ItemService } from './item.service';

@Injectable({ providedIn: 'root' })
export class RelationshipTypeService extends ItemService<RelationshipType> {
  collectionName: string = 'relationship-types';
}
