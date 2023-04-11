import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileViewResolver } from './resolvers/profile-view.resolver';
import { CurrentProfileGuard, ProfileGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/profile.view').then(m => m.ProfileView),
    canActivate: [CurrentProfileGuard], // maybe the names can be modified.....
  },
  {
    path: ':profileId/token/:tokenId',
    loadComponent: () => import('./views/profile.view').then(m => m.ProfileView),
    canActivate: [ProfileGuard],
    resolve: {
      user: ProfileViewResolver,
    },
  },
  {
    path: ':profileId',
    loadComponent: () => import('./views/profile.view').then(m => m.ProfileView),
    resolve: {
      user: ProfileViewResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
