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
import { LangString } from '@cognizone/model-utils';
import { I18nService } from '@cognizone/i18n';
import { TranslocoService } from '@ngneat/transloco';
import { Dialog } from '@angular/cdk/dialog';
import * as echarts from 'echarts';
import { SkillsDetailMapVisualizationModal } from '@app/shared-features/skills-detail-map-visualization';

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
    private dialog: Dialog
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
      this.chart.on('click', 'series.graph', (e) => {
        this.dialog.open(SkillsDetailMapVisualizationModal, {
          data: e.data,
        })
      });
    }
    const data = this.generateData(skills, feedbacks, this.counts);
    this.chart.setOption({
      tooltip: {
        className: 'app-tooltip',
        formatter: ({ data }: FormatterArg) => {
          return `<p class="tooltip-heading">${data.name}</p> 
                  <p class="tooltip-description">${data.description}</p>
                  <p class="tooltip-label">${this.transloco.translate('profile.total')}</p>
                  <p class="tooltip-meta-details">${data.endorsementCount} ${data.endorsementCount > 1 ? this.transloco.translate('profile.endorsements_count') : this.transloco.translate('profile.endorsement_count')}</p>
                  <p class="tooltip-label">${this.transloco.translate('profile.last_endorsement_from')}</p>
                  <p class="tooltip-meta-details">${data.lastEndorsedBy?.fromFirstName || data.lastEndorsedBy?.fromEmail}</p>
                  `;
        },
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          data: data,
          force: {
            repulsion: 250, // TODO - make it smarter
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

  private generateData(skills: Skill[], feedback: Feedback[], counts: Counts): Data[] {
    return skills.map<Data>(skill => {
      return {
        symbolSize: counts[skill['@id']] < 3 ? 120 : 180, // TODO - make it dynamic, add more conditions using switch
        skillId: skill['@id'],
        name: this.i18nService.czLabelToString(skill.prefLabel as LangString),
        endorsementCount: counts[skill['@id']] ?? 0,
        description: this.i18nService.czLabelToString(skill.description as LangString),
        label: {
          show: true,
          fontSize: counts[skill['@id']] < 3 ? 12 : 16,
          fontWeight: 600,
          color: skill.label.color
        },
        itemStyle: {
          color: skill.itemStyle.color
        },
        lastEndorsedBy: feedback.filter(f => f.endorsedSkills?.includes(skill['@id'])).sort((a, b) => new Date(a?.created as Date).getTime() - new Date(b?.created as Date).getTime()).pop(),
        feedback: feedback.filter(f => f.endorsedSkills?.includes(skill['@id']))
      };
    });
  }
}

interface Data {
  name: string;
  description: string;
  label: {
    show: boolean,
    fontSize: number,
    fontWeight: number,
    color: string
  };
  itemStyle: {
    color: string;
  };
  lastEndorsedBy?: Feedback;
  endorsementCount: number;
  skillId: string;
  feedback: Feedback[]
}

interface FormatterArg {
  data: Data;
}
