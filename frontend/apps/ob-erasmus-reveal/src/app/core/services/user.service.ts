import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonModelFields, User } from '../models';
import { randomDelay } from '../utils';
import { ItemService } from './item.service';

@Injectable({ providedIn: 'root' })
export class UserService extends ItemService<User> {
  index: string = 'user';

  getByEmail(email: string): Observable<User | undefined> {
    const user = this.getState().find(u => u.email === email);
    return randomDelay(user);
  }

  create(user: JsonModelFields<User>): Observable<string> {
    const fullUser = { ...this.jsonModelService.createNewBareboneJsonModel('User'), ...user };
    return this.save(fullUser);
  }
}
