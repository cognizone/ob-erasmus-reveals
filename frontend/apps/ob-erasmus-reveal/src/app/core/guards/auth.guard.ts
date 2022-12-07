import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  // TODO - change me after email is ready....
  canActivate(): boolean {
    return !! this.authService.getTemporaryEmailState();
  }
}
