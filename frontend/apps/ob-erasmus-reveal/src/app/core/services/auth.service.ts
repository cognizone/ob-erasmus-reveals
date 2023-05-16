import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';

import { User } from '../models';
import { Initializer } from './initializers-handler.service';
import { UserService } from './user.service';
import { I18nService } from '@cognizone/i18n';
import { HttpClient } from '@angular/common/http';
import { EncodeUriService } from './encode-uri-service';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService implements Initializer {
  get currentUser$(): Observable<User | undefined> {
    return this._currentUser$.asObservable();
  }

  get currentUser(): User {
    return this._currentUser$.value as User;
  }

  private tokenStorageService = inject(TokenStorageService);

  private readonly storageKey: string = 'auth';
  private _currentUser$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

  constructor(
    private userService: UserService,
    private i18nService: I18nService,
    private http: HttpClient,
    private encodeService: EncodeUriService,
    private router: Router
  ) {}

  async init(): Promise<void> {
    const email = this.getState();
    if (!email) return;
    const loggedIn = await firstValueFrom(this.login(email));
    if (!loggedIn) this.setState(null);
  }

  login(email: string): Observable<boolean> {
    return this.userService.getByEmail(email).pipe(
      map(user => {
        this._currentUser$.next(user);
        if (user && !this.tokenStorageService.tokenParams) {
          this.setState(email);
        }
        return !!user;
      })
    );
  }

  userExists(email: string): Observable<boolean> {
    return this.userService.getByEmail(email).pipe(map(user => !!user));
  }

  register(email: string): Observable<string> {
    const body = {
      email: email,
      language: this.i18nService.getActiveLang(),
    };
    return this.http.post('api/signup', body, { responseType: 'text' });
  }

  signin(): Observable<string> {
    const body = {
      email: this.currentUser.email,
      language: this.i18nService.getActiveLang(),
      id: this.encodeService.encode(this.currentUser['@id']),
    };
    return this.http.post('api/signin', body, { responseType: 'text' });
  }

  private getState(): string | null {
    const token = this.tokenStorageService.tokenParams;
    if (token && new Date().getTime() > token['expiry']) {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem('token');
      this.router.navigate(['login']);
      return null;
    }

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
