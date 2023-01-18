import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { combineLatest } from 'rxjs';
import { Skill, SkillsService } from '@app/core';
import { I18nService } from '@cognizone/i18n';
import { LangString } from '@cognizone/model-utils';
import { Dialog } from '@angular/cdk/dialog';
import { OnDestroy$ } from '@cognizone/ng-core';
import { SignUpModalComponent } from '../signup';
import { CommonModule } from '@angular/common';
import { SkillsDetailMapVisualizationModal } from '../skills-detail-map-visualization';
import * as echarts from 'echarts'; // William, I hope these imports are fine

@Component({
  selector: 'ob-erasmus-reveal-skills-visualization',
  standalone: true,
  imports: [CommonModule, SkillsDetailMapVisualizationModal],
  templateUrl: './skills-visualization.component.html',
  styleUrls: ['./skills-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsVisualizationComponent extends OnDestroy$ implements AfterViewInit {
  @Input()
  isConnected: boolean = false;

  @ViewChild('myChart')
  container!: ElementRef<HTMLElement>;
  private chart?: echarts.ECharts;

  constructor(private skillsService: SkillsService, private i18nService: I18nService, private dialog: Dialog, private cdr: ChangeDetectorRef) {
    super();
  }


  ngAfterViewInit(): void {
    this.subSink = combineLatest([
      this.skillsService.getAll(),
      this.i18nService.selectActiveLang()
    ]).subscribe(([skills]) => {
      this.createChart(skills);
      this.cdr.markForCheck();
    });
  }

  private createChart(skills: Skill[]): void {
    if (!this.chart) {
      const chartDom = this.container.nativeElement;
      this.chart = echarts.init(chartDom);
      this.chart.on('click', 'series.graph', (e) => {
        if(this.isConnected) {
          this.dialog.open(SkillsDetailMapVisualizationModal, {
            data: { data: e.data, isConnected: this.isConnected } // TODO - After the Refactor PR gets merged https://github.com/cognizone/ob-erasmus-reveals/pull/23, modify this
          })
        } else {
          // TODO - Complete this part
          /*this.dialog.open(SignUpModalComponent).closed.subscribe(o => {
            // close the dialog(should close on join or even connect) and navigate to complete profile page from here;
          })*/
        }
      });
    }

    this.chart.setOption({
      tooltip: {
        className: 'app-tooltip',
        formatter: '<p class="tooltip-heading">{b0}</p> <p class="tooltip-description">{c0}</p>'
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          data: skills.map((a: Skill) => {
            return {
              symbolSize: a.symbolSize,
              name: this.i18nService.czLabelToString(a.prefLabel as LangString),
              label: {
                show: true,
                fontSize: (a?.symbolSize as number) > 140 ? 16 : 12,
                fontWeight: 600,
                color: a.label.color
              },
              itemStyle: {
                color: a.itemStyle.color
              },
              value: this.i18nService.czLabelToString(a.description as LangString),
            }
          }),
          force: {
            repulsion: 500,
          },
        },
      ],
    });
  }
}
