import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class OtherUserProfileGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  // Still going to keep it, they might ask to put this back in the future.
  canActivate(next: ActivatedRouteSnapshot): boolean | UrlTree {
    const { profileId } = next.params;
    return !!(profileId && this.authService.currentUser);
  }
}
