import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '@app/shared';
import { MyProfileFooterComponent } from '@app/shared-features/my-profile-footer/components/my-profile-footer.component';

const routes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    MyProfileFooterComponent,
    LoginRoutingModule,
    RouterModule.forChild(routes),
    TranslocoLocaleModule,
    SharedModule,
  ],
})
export class LoginModule {}
