import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, User } from '@app/core';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  userInfo!: User;
  constructor(private authService: AuthService) {}

  getUserInfo(route: ActivatedRoute): User {
    const { user } = route.snapshot.data;
    return  user ?? this.authService.currentUser
  }
}
