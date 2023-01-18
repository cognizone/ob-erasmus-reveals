import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { combineLatest } from 'rxjs';
import { Counts, Feedback, FeedbacksService, Skill, SkillsService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';
import { LangString } from '@cognizone/model-utils';
import { I18nService } from '@cognizone/i18n';
import { TranslocoService } from '@ngneat/transloco';
import { EChartsOption } from 'echarts';
import { Dialog } from '@angular/cdk/dialog';
import { SkillsDetailMapVisualizationModal } from '../skills-detail-map-visualization/skills-detail-map-visualization.modal';

@Component({
  selector: 'ob-erasmus-reveal-skills-cloud-visualization',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
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
  options!: EChartsOption;

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
      this.options = this.createChart(skills, feedbacks) as EChartsOption;
      this.cdr.markForCheck();
    })
  }

  // TODO - see if the event can have a type.
  onChartClick(event: any): void {
    this.dialog.open(SkillsDetailMapVisualizationModal, {
      data: event.data,
    })
  }

  private createChart(skills: Skill[], feedbacks: Feedback[]): EChartsOption {
    const data = this.generateData(skills, feedbacks, this.counts);
    {
      return {
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
          },
        ],
      } as unknown as EChartsOption
    }
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
