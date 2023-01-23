import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  Input,
  OnInit, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
import { Counts, Feedback, FeedbacksService, Skill, SkillsService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';
import { I18nService } from '@cognizone/i18n';
import { TranslocoService } from '@ngneat/transloco';
import { Dialog } from '@angular/cdk/dialog';
import * as echarts from 'echarts';
import { SkillsDetailMapVisualizationModal } from '@app/shared-features/skills-detail-map-visualization';
import { ChartData, ChartMetaData, ChartDataService, FormatterArg } from '@app/shared-features/skills-visualization';

@Component({
  selector: 'ob-erasmus-reveal-skills-cloud-visualization',
  standalone: true,
  imports: [CommonModule, SkillsDetailMapVisualizationModal],
  templateUrl: './skills-cloud-visualization.component.html',
  styleUrls: ['./skills-cloud-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsCloudVisualizationComponent extends OnDestroy$ implements OnInit {
  @Input()
  skillsUris!: string[];
  @Input()
  counts!: Counts;
  @Input()
  userId!: string;

  @ViewChild('myChart')
  container!: ElementRef<HTMLElement>;

  private chart?: echarts.ECharts;

  constructor(
    private skillsService: SkillsService,
    private i18nService: I18nService,
    private feedbackService: FeedbacksService,
    private transloco: TranslocoService,
    private cdr: ChangeDetectorRef,
    private dialog: Dialog,
    private chartDataService: ChartDataService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subSink = combineLatest([
      this.skillsService.getSkillForEndorsement(this.skillsUris),
      this.feedbackService.getFeedbacksForUser(this.userId),
      this.i18nService.selectActiveLang()
    ]).subscribe(([skills, feedbacks]) => {
      this.createChart(skills, feedbacks);
      this.cdr.markForCheck();
    })
  }

  private createChart(skills: Skill[], feedbacks: Feedback[]): void {
    if (!this.chart) {
      const chartDom = this.container.nativeElement;
      this.chart = echarts.init(chartDom);
      // TODO - commenting this for now, need to add this for highlighting and downplaying the newly endorsed skill :grin
      /*this.chart.on('mouseover', 'series.graph', (e) => {
        this.chart?.dispatchAction({ type: 'downplay' });
      })*/
      this.chart.on('click', 'series.graph', (event) => {
        const data = event.data as ChartData;
        this.dialog.open(SkillsDetailMapVisualizationModal, {
          data: data.metaData as ChartMetaData,
        })
      });
    }

    this.chart.setOption({
      tooltip: {
        className: 'app-tooltip',
        formatter: ({ data }: FormatterArg) => {
          return `<p class="tooltip-heading">${data.name}</p>
                  <p class="tooltip-description">${data.value}</p>
                  <p class="tooltip-label">${this.transloco.translate('profile.total')}</p>
                  <p class="tooltip-meta-details">${data?.metaData?.endorsementCount} ${data.metaData?.endorsementCount && data.metaData.endorsementCount > 1 ? this.transloco.translate('profile.endorsements_count') : this.transloco.translate('profile.endorsement_count')}</p>
                  <p class="tooltip-label">${this.transloco.translate('profile.last_endorsement_from')}</p>
                  <p class="tooltip-meta-details">${data.metaData?.lastEndorsedBy?.fromFirstName || data.metaData?.lastEndorsedBy?.fromEmail}</p>
                  `;
        },
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          data: this.chartDataService.generateData(skills, feedbacks, this.counts),
          force: {
            repulsion: skills.length > 6 ? 400 : 250,
          },
          // Need this for future :)
          /*itemStyle: {
            emphasis: {
              borderColor: 'red',
              borderWidth: 5
            },
          }*/
        },
      ]
    });
    // TODO - commenting this for now, need to add this
    // Find which skill has been recently endorsed for the user, should go away when user clicks on it.
    // This can be handled with localStorage
    /*this.chart?.dispatchAction({ type: 'highlight', dataIndex: 0 })*/
  }
}
