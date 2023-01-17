import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService, EncodeUriService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private encodeUriService: EncodeUriService) {}

  canActivate(next: ActivatedRouteSnapshot): boolean | UrlTree {
    const { profileId } = next.params;
    if (profileId && this.authService.currentUser) {
      return true;
    }

    if (this.authService.currentUser) {
      return this.router.createUrlTree([`profile/${this.encodeUriService.encode(this.authService.currentUser['@id'])}`], {});
    }
    // For now going to profile page if not logged in
    return this.router.createUrlTree(['']);
  }
}
