import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileViewResolver } from './resolvers/profile-view.resolver';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/profile.view').then(m => m.ProfileView),
  },
  {
    path: ':profileId',
    loadComponent: () =>
      import('./views/profile.view').then(m => m.ProfileView),
    resolve: {
      user: ProfileViewResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
