import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Counts, FeedbacksService } from '@app/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProfileHeaderComponent } from '@app/shared-features/profile-header';
import { ProfileFooterComponent } from '@app/shared-features/profile-footer';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { map, Observable, switchMap } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SkillsCloudVisualizationComponent } from '../components/skills-cloud-visualization/skills-cloud-visualization.component';
import { ProfileViewService } from '../services/profile-view.service';

@Component({
  selector: 'ob-erasmus-reveal-profile',
  standalone: true,
  providers: [LoadingService, ProfileViewService],
  imports: [
    CommonModule,
    TranslocoModule,
    ProfileHeaderComponent,
    NgOptimizedImage,
    RouterModule,
    MatIconModule,
    ProfileFooterComponent,
    MatProgressBarModule,
    SkillsCloudVisualizationComponent
  ],
  templateUrl: './profile.view.html',
  styleUrls: ['./profile.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileView extends OnDestroy$ implements OnInit {
  userId!: string;
  userInfo!: string;
  userEmail!: string;
  endorsedSkillsUris: string[] = [];
  endorsementsCount: number = 0;
  endorsedSkillCounts!: Counts;
  loading$: Observable<boolean> = this.loadingService.loading$;

  constructor(
    private feedbackService: FeedbacksService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
    private profileViewService: ProfileViewService
  ) {
    super();
  }

  ngOnInit() {
    this.subSink = this.profileViewService.user$
    .pipe(switchMap(user => this.feedbackService.getSkillsCountsPerUser(user?.['@id'])
    .pipe(this.loadingService.asOperator(),map(result => ({ user, result })))))
    .subscribe(({ user, result }) => {
      if (user?.firstName || user?.lastName) {
        this.userInfo = `${user?.firstName} ${user.lastName}`
        this.userEmail = user?.email as string;
      } else {
        this.userInfo = user?.email as string;
      }
      this.userId = user['@id'];
      this.endorsedSkillsUris = Object.keys(result);
      if (this.endorsedSkillsUris.length > 0) {
        this.endorsementsCount = Object.values(result).reduce((a, b) => a + b);
      }
      this.endorsedSkillCounts = result;
      this.cdr.markForCheck();
    });
  }
}
