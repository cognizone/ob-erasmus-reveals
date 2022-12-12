import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalSkillsVisualizationComponent } from './global-skills-visualization.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalSkillsVisualizationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSkillsVisualizationRoutingModule {}
