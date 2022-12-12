import { APP_INITIALIZER, Injectable, Provider } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';

import { User } from '../models';
import { Initializer, randomDelay } from '../utils';
import { ConfigService } from './config.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements Initializer {
  get currentUser$(): Observable<User | undefined> {
    return this._currentUser$.asObservable();
  }

  private readonly storageKey: string = 'auth';
  private _currentUser$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

  constructor(private userService: UserService, private configService: ConfigService) {}

  async init(): Promise<void> {
    const email = this.getState();
    if (!email) return;
    await this.configService.init();
    await firstValueFrom(this.login(email));
  }

  login(email: string): Observable<boolean> {
    return this.userService.getByEmail(email).pipe(
      map(user => {
        this._currentUser$.next(user);
        if (user) {
          this.setState(email);
        }
        return !!user;
      })
    );
  }

  // TODO send email api
  register(email: string): Observable<unknown> {
    return randomDelay(email);
  }

  private getState(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  private setState(email: string | null): void {
    if (email) {
      localStorage.setItem(this.storageKey, email);
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }
}
