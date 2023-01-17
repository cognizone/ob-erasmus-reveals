import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class OtherUserProfileGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot): boolean | UrlTree {
    const { profileId } = next.params;
    return !!(profileId && this.authService.currentUser);
  }
}
