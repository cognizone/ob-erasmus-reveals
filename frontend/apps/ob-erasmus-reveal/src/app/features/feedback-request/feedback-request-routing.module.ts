import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileAuthGuard } from '@app/core';

const routes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./views/feedback-request-creation/feedback-request-creation.view').then(m => m.FeedbackRequestCreationView),
    canActivate: [ProfileAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackRequestRoutingModule {}
