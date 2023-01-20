import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';

import { User } from '../models';
import { Initializer } from './initializers-handler.service';
import { UserService } from './user.service';
import { I18nService } from '@cognizone/i18n';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService implements Initializer {
  get currentUser$(): Observable<User | undefined> {
    return this._currentUser$.asObservable();
  }

  get currentUser(): User {
    return this._currentUser$.value as User;
  }

  private readonly storageKey: string = 'auth';
  private _currentUser$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

  constructor(private userService: UserService, private i18nService: I18nService, private http: HttpClient) {}

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

  register(email: string): Observable<string> {
    const body = {
      email: email,
      language: this.i18nService.getActiveLang()
    };
    return this.http.post('api/signup', body) as Observable<string>;
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
