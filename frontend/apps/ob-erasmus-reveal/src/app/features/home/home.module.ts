import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from "../../shared";
import { CommonModule } from '@angular/common';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    RouterModule.forChild(routes),
    TranslocoLocaleModule,
    SharedModule,
    CommonModule,
  ],
})
export class HomeModule {}
