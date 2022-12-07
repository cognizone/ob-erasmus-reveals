import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { GetStartedRoutingModule } from './get-started-routing.module';
import { GetStartedComponent } from './get-started.component';
import { SharedModule } from '../../shared';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [{ path: '', component: GetStartedComponent }];

@NgModule({
  declarations: [GetStartedComponent],
  imports: [GetStartedRoutingModule, RouterModule.forChild(routes), TranslocoLocaleModule, SharedModule, MatButtonModule],
})
export class GetStartedModule {}
