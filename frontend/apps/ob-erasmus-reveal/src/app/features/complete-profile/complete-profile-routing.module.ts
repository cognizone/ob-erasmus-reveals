import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompleteProfileView } from './views/complete-profile.view';

const routes: Routes = [{ path: '', component: CompleteProfileView }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompleteProfileRoutingModule {}
