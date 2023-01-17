import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService, EncodeUriService } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private encodeUriService: EncodeUriService) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.currentUser) {
      return this.router.createUrlTree([`profile/${this.encodeUriService.encode(this.authService.currentUser['@id'])}`], {});
    }
    // For now going to home page if not logged in
    return this.router.createUrlTree(['']);
  }
}
