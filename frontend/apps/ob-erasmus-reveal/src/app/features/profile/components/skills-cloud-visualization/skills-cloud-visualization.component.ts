import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, delay, forkJoin, map } from 'rxjs';
import { AuthService, Counts, Feedback, FeedbacksService, Notification, NotificationService, Skill, SkillsService } from '@app/core';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { I18nService } from '@cognizone/i18n';
import { TranslocoService } from '@ngneat/transloco';
import { Dialog } from '@angular/cdk/dialog';
import * as echarts from 'echarts';
import { SkillsDetailMapVisualizationModal } from '@app/shared-features/skills-detail-map-visualization';
import { ChartDataService } from '@app/shared-features/skills-visualization';
import produce from 'immer';
import { ProfileViewService } from '../../services/profile-view.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChartData, FormatterArg, SkillUsersService } from '@app/shared-features/meta-visualization';
import { Router } from '@angular/router';

@Component({
  selector: 'ob-erasmus-reveal-skills-cloud-visualization',
  standalone: true,
  imports: [CommonModule, SkillsDetailMapVisualizationModal, MatProgressSpinnerModule],
  providers: [ProfileViewService, LoadingService, SkillUsersService],
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
  notifications!: Notification[];
  private chart?: echarts.ECharts;

  constructor(
    private skillsService: SkillsService,
    private i18nService: I18nService,
    private feedbackService: FeedbacksService,
    private transloco: TranslocoService,
    private cdr: ChangeDetectorRef,
    private dialog: Dialog,
    private authService: AuthService,
    private chartDataService: ChartDataService,
    private notificationService: NotificationService,
    private profileViewService: ProfileViewService,
    private skillUserService: SkillUsersService,
    private router: Router,
    private injector: Injector,
    public loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subSink = this.skillUserService.selectedUris$.subscribe(params => {
      if (!params.selectedSkillUri) return;
      // Need to make sure when the user clicks on country,
      // the modal doesn't open up again in the background
      if (this.dialog.openDialogs.length < 1) {
        this.dialog.open<boolean>(SkillsDetailMapVisualizationModal, {
          injector: this.injector,
        });
      }
    });

    this.subSink = combineLatest([
      this.skillsService.getSkillForEndorsement(this.skillsUris).pipe(this.loadingService.asOperator()),
      this.feedbackService.getFeedbacksForUser(this.userId).pipe(this.loadingService.asOperator()),
      this.profileViewService.notifications$.pipe(
        map(notifications => (this.userId === this.authService.currentUser['@id'] ? notifications : []))
      ),
      this.i18nService.selectActiveLang(),
    ]).subscribe(([skills, feedbacks, notifications]) => {
      this.notifications = notifications;
      this.createChart(skills, feedbacks);
      this.cdr.markForCheck();
    });
  }

  private createChart(skills: Skill[], feedbacks: Feedback[]): void {
    if (!this.chart) {
      const chartDom = this.container.nativeElement;
      this.chart = echarts.init(chartDom);
      this.chart.on('click', 'series.graph', event => {
        const { metaData } = event.data as ChartData;

        // updating notifications
        const updatedNotifications = this.notifications.reduce((acc, notification) => {
          if (notification.endorsedSkill === metaData?.skillUri) {
            acc.push(
              produce(notification, draft => {
                draft.acknowledged = true;
              })
            );
          }
          return acc;
        }, [] as Notification[]);

        if (updatedNotifications.length) {
          // Note - The delay is used here to make the document available after update/index from elasticsearch.
          this.subSink = forkJoin(updatedNotifications.map(notification => this.notificationService.save(notification)))
            .pipe(delay(1000))
            .subscribe(() => {
              this.profileViewService.refresh();
              this.chart?.dispatchAction({ type: 'downplay', dataIndex: this.getIndexesOfSkills(skills, this.notifications) });
              this.cdr.markForCheck();
            });
        }

        this.router.navigate([], { queryParams: { selectedSkillUri: encodeURIComponent(metaData?.skillUri as string) } });
      });

      // on mouseover
      this.chart.on('mouseover', 'series.graph', event => {
        const { metaData } = event.data as ChartData;
        // When there are notifications, need to make sure on acknowledged notifications we don't show highlight
        if (this.notifications.some(n => n.endorsedSkill !== metaData?.skillUri)) {
          // Downplay has to be set first and then highlight on the rest of the bubbles
          this.chart?.dispatchAction({ type: 'downplay' });
          this.chart?.dispatchAction({
            type: 'highlight',
            dataIndex: this.getIndexesOfSkills(skills, this.notifications),
          });
        }
      });
    }

    const data = this.chartDataService.generateData(skills, this.counts, feedbacks);
    this.skillUserService.chartsData$.next(data);

    this.chart.setOption({
      tooltip: {
        className: 'app-tooltip',
        formatter: ({ data }: FormatterArg) => {
          return `<p class="tooltip-heading">${data.name}</p>
                  <p class="tooltip-description">${data.value}</p>
                  <p class="tooltip-label">${this.transloco.translate('profile.total')}</p>
                  <p class="tooltip-meta-details">${data?.metaData?.endorsementCount} ${
            data.metaData?.endorsementCount && data.metaData.endorsementCount > 1
              ? this.transloco.translate('profile.endorsements_count')
              : this.transloco.translate('profile.endorsement_count')
          }</p>
                  <p class="tooltip-label">${this.transloco.translate('profile.last_endorsement_from')}</p>
                  <p class="tooltip-meta-details">${
                    data.metaData?.lastEndorsedBy?.fromFirstName || data.metaData?.lastEndorsedBy?.fromEmail
                  }</p>
                  `;
        },
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          data,
          force: {
            repulsion: 400,
            friction: 0.4,
          },
          top: skills.length > 6 ? '40%' : '20%',
          height: 150, // This helps to align the component height along with the height provided to the whole chart itself
        },
      ],
    });
    if ((this.notifications?.length ?? 0) > 0) {
      this.chart.setOption({
        emphasis: {
          itemStyle: {
            borderColor: 'red',
            borderWidth: 5,
          },
        },
      });
      this.chart.dispatchAction({
        type: 'highlight',
        dataIndex: this.getIndexesOfSkills(skills, this.notifications),
      });
    }
  }

  private getIndexesOfSkills(skill: Skill[], notifications: Notification[]): string[] {
    return skill.reduce((a: string[], curr, index) => {
      if (!notifications.length) return [];
      if (notifications.some(n => n.endorsedSkill === curr['@id'])) {
        a.push(index.toString());
      }
      return a;
    }, []);
  }
}
