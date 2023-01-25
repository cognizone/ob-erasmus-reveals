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
import { Counts, FeedbacksService, Skill, SkillsService } from '@app/core';
import { I18nService } from '@cognizone/i18n';
import { Dialog } from '@angular/cdk/dialog';
import { OnDestroy$ } from '@cognizone/ng-core';
import { SignUpModalComponent } from '../signup';
import { CommonModule } from '@angular/common';
import { SkillsDetailMapVisualizationModal } from '../skills-detail-map-visualization';
import * as echarts from 'echarts';
import { ChartDataService } from './services/chart-data.service';
import { ChartData, ChartMetaData } from './models';

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
  endorsedSkillCounts!: Counts;
  private chart?: echarts.ECharts;

  constructor(private skillsService: SkillsService, private i18nService: I18nService, private dialog: Dialog, private cdr: ChangeDetectorRef, private chartDataService: ChartDataService, private feedbackService: FeedbacksService) {
    super();
  }


  ngAfterViewInit(): void {
    this.subSink = combineLatest([
      this.skillsService.getAll(),
      this.feedbackService.getGlobalSkillCount(),
      this.i18nService.selectActiveLang()
    ]).subscribe(([skills, counts]) => {
      this.endorsedSkillCounts = counts;
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
          const data = e.data as ChartData;
          this.dialog.open(SkillsDetailMapVisualizationModal, {
            data: data['metaData'] as ChartMetaData,
          })
        } else {
          this.dialog.open(SignUpModalComponent)
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
          data: this.chartDataService.generateData(skills, this.endorsedSkillCounts),
          force: {
            repulsion: 500,
          },
        },
      ],
    });
  }
}
