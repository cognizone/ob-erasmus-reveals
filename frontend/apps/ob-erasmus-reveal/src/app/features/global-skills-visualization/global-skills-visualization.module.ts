import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { SharedModule } from '@app/shared';
import { GlobalSkillsVisualizationComponent } from './global-skills-visualization.component';
import { GlobalSkillsVisualizationRoutingModule } from './global-skills-visualization-routing.module';


@NgModule({
  declarations: [GlobalSkillsVisualizationComponent],
  imports: [
    TranslocoLocaleModule,
    SharedModule,
    CommonModule,
    GlobalSkillsVisualizationRoutingModule
  ]
})
export class GlobalSkillsVisualizationModule { }
