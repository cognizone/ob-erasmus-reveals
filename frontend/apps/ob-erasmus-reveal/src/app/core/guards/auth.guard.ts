import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  // TODO - Can be used for other profile features, to be modified
  canActivate(): boolean {
    return !! this.authService.currentUser;
  }
}
