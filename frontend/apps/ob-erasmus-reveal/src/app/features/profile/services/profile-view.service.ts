import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/core';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileViewService {
  user!: User;
  private refresh$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  getUser(route: ActivatedRoute): Observable<User> {
    return combineLatest([route.data, this.refresh$]).pipe(debounceTime(0),map(([params]) => {
      const { user } = params;
      return user;
    }), shareReplay(1));
  }

  refresh(): void {
    this.refresh$.next();
  }
}
