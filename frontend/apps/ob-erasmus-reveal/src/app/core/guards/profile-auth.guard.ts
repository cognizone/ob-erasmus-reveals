import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService, EncodeUriService, TokenStorageService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class ProfileAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private encodeUriService: EncodeUriService,
    private tokenStorage: TokenStorageService
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.currentUser && this.tokenStorage.tokenParams) {
      return this.router.createUrlTree(
        ['profile', this.encodeUriService.encode(this.authService.currentUser['@id']), 'token', this.tokenStorage.tokenParams['value']],
        {}
      );
    } else if (this.authService.currentUser) {
      return this.router.createUrlTree(['profile', this.encodeUriService.encode(this.authService.currentUser['@id'])], {});
    }
    return true;
  }
}
