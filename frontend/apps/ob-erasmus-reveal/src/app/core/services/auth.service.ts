import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';

import { User } from '../models';
import { randomDelay } from '../utils';
import { Initializer } from './initializers-handler.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements Initializer {
  get currentUser$(): Observable<User | undefined> {
    return this._currentUser$.asObservable();
  }

  get currentUser(): User {
    // TODO remove fake user when login is implemented
    return this._currentUser$.value ?? { '@id': 'http://reveal.org/data/user/mario', '@type': 'User', email: 'mario.mario@nintendo.com' };
  }

  private readonly storageKey: string = 'auth';
  private readonly temporaryStorageKey: string = 'temp'; // Using this till the user is not registered and logged in
  private _currentUser$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

  constructor(private userService: UserService) {}

  async init(): Promise<void> {
    const email = this.getState();
    if (!email) return;
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
    this.setTemporaryEmail(email);
    return randomDelay(email);
  }

  getTemporaryEmailState(): string {
    return localStorage.getItem(this.temporaryStorageKey) as string;
  }

  private setTemporaryEmail(email: string): void {
    localStorage.setItem(this.temporaryStorageKey, email);
  }

  private getState(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  private setState(email: string | null): void {
    if (email) {
      localStorage.setItem(this.storageKey, email);
      localStorage.removeItem(this.temporaryStorageKey);
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }
}
