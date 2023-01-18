import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { EncodeUriService, User, UserService } from '@app/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileViewResolver implements Resolve<User> {
  constructor(private encodeUriService: EncodeUriService, private userService: UserService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<User> {
    let { profileId } = route.params;
    profileId = this.encodeUriService.decode(profileId);
    return await firstValueFrom(this.userService.getByUri(profileId));
  }
}
