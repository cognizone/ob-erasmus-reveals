import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { CompleteProfileRoutingModule } from './complete-profile-routing.module';
import { SharedModule } from '@app/shared';
import { CompleteProfileView } from './views/complete-profile.view';
import { CommonModule } from '@angular/common';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { AppLogoComponent } from '@app/shared-features/app-logo';

const routes: Routes = [{ path: '', component: CompleteProfileView }];

@NgModule({
  declarations: [CompleteProfileView, GettingStartedComponent, CreateProfileComponent],
  imports: [CompleteProfileRoutingModule, RouterModule.forChild(routes), TranslocoLocaleModule, SharedModule, CommonModule, MatStepperModule, ReactiveFormsModule, AppLogoComponent],
})
export class CompleteProfileModule {}
