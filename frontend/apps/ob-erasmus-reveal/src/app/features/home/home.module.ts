import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from "../../shared";

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    MatRippleModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslocoLocaleModule,
    SharedModule,
  ],
})
export class HomeModule {}
