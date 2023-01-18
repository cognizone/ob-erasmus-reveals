import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { SharedModule } from '@app/shared';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SkillsVisualizationComponent } from '@app/shared-features/skills-visualization';
import { HeaderComponent } from '@app/shared-features/header';
import { FooterComponent } from '@app/shared-features/footer';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    RouterModule.forChild(routes),
    TranslocoLocaleModule,
    SharedModule,
    CommonModule,
    SkillsVisualizationComponent,
    HeaderComponent,
    FooterComponent
  ],
})
export class HomeModule {}
