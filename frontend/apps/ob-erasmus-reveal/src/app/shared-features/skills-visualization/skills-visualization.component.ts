import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,Injector, Input, ViewChild ,
} from '@angular/core';
import { Router } from '@angular/router';
import { Counts, FeedbacksService, Skill, SkillsService } from '@app/core';
import { I18nService } from '@cognizone/i18n';
import { OnDestroy$ } from '@cognizone/ng-core';
import * as echarts from 'echarts';
import { combineLatest } from 'rxjs';

import { ChartData, SkillUsersService } from '../meta-visualization';
import { SignUpModalComponent } from '../signup';
import { SkillsDetailMapVisualizationModal } from '../skills-detail-map-visualization';
import { ChartDataService } from './services/chart-data.service';

@Component({
  selector: 'ob-erasmus-reveal-skills-visualization',
  standalone: true,
  imports: [CommonModule, SkillsDetailMapVisualizationModal],
  templateUrl: './skills-visualization.component.html',
  styleUrls: ['./skills-visualization.component.scss'],
  providers: [SkillUsersService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsVisualizationComponent extends OnDestroy$ implements AfterViewInit {
  @Input()
  isConnected: boolean = false;

  @ViewChild('myChart')
  container!: ElementRef<HTMLElement>;
  endorsedSkillCounts!: Counts;
  private chart?: echarts.ECharts;

  constructor(
    private skillsService: SkillsService,
    private i18nService: I18nService,
    private dialog: Dialog,
    private cdr: ChangeDetectorRef,
    private chartDataService: ChartDataService,
    private feedbackService: FeedbacksService
  ,
    private router: Router,
    public skillUserService: SkillUsersService,
    private injector: Injector
  ) {
    super();
  }


  ngAfterViewInit(): void {
    this.subSink = this.skillUserService.selectedUris$.subscribe(params => {
      if (!params.selectedSkillUri) return;
      // Need to make sure when the user clicks on country,
      // the modal doesn't open up again in the background
      if (this.dialog.openDialogs.length < 1) {
        if (this.isConnected) {
          this.dialog.open(SkillsDetailMapVisualizationModal, {
            injector: this.injector,
          });
        } else {
          this.dialog.open(SignUpModalComponent);
        }
      }
    });

    this.subSink = combineLatest([
      this.skillsService.getAll(),
      this.feedbackService.getGlobalSkillCount(),
      this.i18nService.selectActiveLang(),
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
      this.chart.on('click', 'series.graph', e => {
        const { metaData } = e.data as ChartData;
        this.router.navigate([], { queryParams: { selectedSkillUri: encodeURIComponent(metaData?.skillUri as string) } });
      });
    }

    const data = this.chartDataService.generateData(skills, this.endorsedSkillCounts);
    this.skillUserService.chartsData$.next(data);

    this.chart.setOption({
      tooltip: {
        className: 'app-tooltip',
        formatter: '<p class="tooltip-heading">{b0}</p> <p class="tooltip-description">{c0}</p>',
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          data,
          force: {
            repulsion: 500,
          },
          top: skills.length > 6 ? '40%' : '20%',
          height: 150, // This helps to align the component height along with the height provided to the whole chart itself
        },
      ],
    });
  }
}
