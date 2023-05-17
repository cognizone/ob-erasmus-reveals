import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Say the user can logged in and waiting for the email and refreshes, so we make sure user stays there
    if (!this.tokenStorage.tokenParams) {
      if (state.url === '/login' || state.url === '/' || state.url === '/signup' || state.url === '/global-skills') {
        return true;
      }
    } else if (!this.authService.getTokenState()) {
      // when the token has expired.
      // Redirect to the login page for other routes when the user is not logged in
      return this.router.createUrlTree(['login']);
    }

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
