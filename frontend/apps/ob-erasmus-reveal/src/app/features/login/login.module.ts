import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '@app/shared';
import { ProfileFooterComponent } from '@app/shared-features/profile-footer';

const routes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
  declarations: [LoginComponent],
  imports: [ProfileFooterComponent, LoginRoutingModule, RouterModule.forChild(routes), TranslocoLocaleModule, SharedModule],
})
export class LoginModule {}
