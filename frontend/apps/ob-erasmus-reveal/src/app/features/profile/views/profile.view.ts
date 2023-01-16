import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Counts, FeedbacksService, User } from '@app/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProfileHeaderComponent } from '@app/shared-features/profile-header';
import { ProfileFooterComponent } from '@app/shared-features/profile-footer';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SkillsCloudVisualizationComponent } from '../components/skills-cloud-visualization/skills-cloud-visualization.component';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'ob-erasmus-reveal-profile',
  standalone: true,
  providers: [LoadingService],
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
  user!: User;
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
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.user = this.profileService.getUserInfo(this.route);
    if (this.user?.firstName || this.user?.lastName) {
      this.userInfo = `${this.user?.firstName} ${this.user.lastName}`
      this.userEmail = this.user?.email as string;
    } else {
      this.userInfo = this.user?.email as string
    }
    this.subSink = this.feedbackService.getSkillsCountsPerUser(this.user?.['@id']).pipe(this.loadingService.asOperator()).subscribe(result => {
      this.endorsedSkillsUris = Object.keys(result);
      if (this.endorsedSkillsUris.length > 0) {
        this.endorsementsCount = Object.values(result).reduce((a, b) => a + b);
      }
      this.endorsedSkillCounts = result;
      this.cdr.markForCheck();
    });
  }
}
