import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService, EncodeUriService, TokenStorageService } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private encodeUriService: EncodeUriService,
    private tokenStorage: TokenStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (this.authService.currentUser && !this.tokenStorage.tokenParams) {
      const { profileId, tokenId } = route.params;
      this.tokenStorage.tokenParams = tokenId;
      return this.router.createUrlTree([`profile/${this.encodeUriService.encode(profileId)}/token/${tokenId}`], {});
    }
    return true;
  }
}
