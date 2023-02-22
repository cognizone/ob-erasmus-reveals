import { Injectable } from '@angular/core';
import { extractOneSourceFromElasticResponse } from '@cognizone/model-utils';
import { catchError, map, Observable, of } from 'rxjs';

import { JsonModelFields, User } from '../models';
import { ItemService } from './item.service';

@Injectable({ providedIn: 'root' })
export class UserService extends ItemService<User> {
  collectionName: string = 'users';

  getByEmail(email: string): Observable<User | undefined> {
    return this.elasticService
      .search<User | undefined>(this.getIndex(), {
        size: 1,
        query: {
          bool: {
            filter: {
              term: {
                'email.keyword': email,
              },
            },
          },
        },
      })
      .pipe(
        map(extractOneSourceFromElasticResponse),
        catchError(err => {
          console.error('Failed to fetch user', err);
          return of(undefined);
        })
      );
  }

  create(user: JsonModelFields<User>): Observable<string> {
    const fullUser = { ...this.jsonModelService.createNewBareboneJsonModel('User'), ...user };
    return this.save(fullUser);
  }

  override getAll(): Observable<User[]> {
    throw new Error('Should not be called for this model');
  }
}
