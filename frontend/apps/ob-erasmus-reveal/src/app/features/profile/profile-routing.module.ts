import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileViewResolver } from './resolvers/profile-view.resolver';
import { ProfileGuard, OtherUserProfileGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/profile.view').then(m => m.ProfileView),
    canActivate: [ProfileGuard]
  },
  {
    path: ':profileId',
    loadComponent: () =>
      import('./views/profile.view').then(m => m.ProfileView),
    resolve: {
      user: ProfileViewResolver
    },
    canActivate: [OtherUserProfileGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
