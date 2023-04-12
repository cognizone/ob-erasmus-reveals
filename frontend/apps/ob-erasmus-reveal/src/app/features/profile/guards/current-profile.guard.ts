import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService, EncodeUriService, TokenStorageService } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class CurrentProfileGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private encodeUriService: EncodeUriService,
    private tokenStorage: TokenStorageService
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.currentUser && this.tokenStorage.tokenParams) {
      return this.router.createUrlTree(
        ['profile', this.encodeUriService.encode(this.authService.currentUser['@id']), 'token', this.tokenStorage.tokenParams],
        {}
      );
    } else if (this.authService.currentUser) {
      return this.router.createUrlTree(['profile', this.encodeUriService.encode(this.authService.currentUser['@id'])], {});
    }
    return true;
  }
}
