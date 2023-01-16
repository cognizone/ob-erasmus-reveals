import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthService, Counts, FeedbacksService } from '@app/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProfileHeaderComponent } from '@app/shared-features/profile-header';
import { ProfileFooterComponent } from '@app/shared-features/profile-footer';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SkillsCloudVisualizationComponent } from '../components/skills-cloud-visualization/skills-cloud-visualization.component';

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
  userInfo!: string;
  userEmail!: string;
  endorsedSkillsUris: string[] = [];
  endorsementsCount: number = 0;
  endorsedSkillCounts!: Counts;
  loading$: Observable<boolean> = this.loadingService.loading$;
  constructor(public authService: AuthService, private feedbackService: FeedbacksService, private cdr: ChangeDetectorRef, private loadingService: LoadingService) {
    super();
  }

  ngOnInit() {
    // TODO - add a condition when the profile has a id, which means it is for the other user and not the logged in user
    if (this.authService.currentUser?.firstName || this.authService.currentUser?.lastName) {
      this.userInfo = `${this.authService.currentUser?.firstName} ${this.authService.currentUser?.lastName}`
      this.userEmail = this.authService.currentUser?.email as string;
    } else {
      this.userInfo = this.authService.currentUser?.email as string
    }
    this.subSink = this.feedbackService.getSkillsCountsPerUser(this.authService.currentUser?.['@id']).pipe(this.loadingService.asOperator()).subscribe(result => {
      this.endorsedSkillsUris = Object.keys(result);
      if (this.endorsedSkillsUris.length > 0) {
        this.endorsementsCount = Object.values(result).reduce((a, b) => a + b);
      }
      this.endorsedSkillCounts = result;
      this.cdr.markForCheck();
    });
  }
}
