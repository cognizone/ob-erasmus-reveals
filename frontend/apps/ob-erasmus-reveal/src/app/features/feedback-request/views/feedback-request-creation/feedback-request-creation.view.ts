import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FeedbackRequestsService, Skill, SkillsService } from '@app/core';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { TranslocoModule } from '@ngneat/transloco';
import { map, of, switchMap } from 'rxjs';

import {
  FeedbackRequestCreationModal,
  FeedbackRequestCreationModalData,
} from '../../components/feedback-request-creation/feedback-request-creation.modal';
import { ProfileHeaderComponent } from '@app/shared-features/profile-header';
import { SkillsFeedbackComponent } from '@app/shared-features/skills-feedback';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'ob-erasmus-reveal-feedback-request-creation',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    RouterModule,
    DialogModule,
    ProfileHeaderComponent,
    SkillsFeedbackComponent,
    MatProgressBarModule
  ],
  providers: [LoadingService],
  templateUrl: './feedback-request-creation.view.html',
  styleUrls: ['./feedback-request-creation.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackRequestCreationView extends OnDestroy$ implements OnInit {
  selectedSkills: string[] = [];
  skills: Skill[] = [];

  constructor(
    private skillsService: SkillsService,
    private cdr: ChangeDetectorRef,
    private dialog: Dialog,
    private feedbackRequestsService: FeedbackRequestsService,
    private router: Router,
    public loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subSink = this.skillsService.getAll().pipe(this.loadingService.asOperator()).subscribe(skills => {
      this.skills = skills;
      this.cdr.markForCheck();
    });
  }

  openModal(): void {
    this.subSink = this.feedbackRequestsService
      .createBase({ skills: this.selectedSkills })
      .pipe(
        this.loadingService.asOperator(),
        switchMap(request =>
          this.dialog
            .open<boolean>(FeedbackRequestCreationModal, {
              data: { feedbackRequest: request } as FeedbackRequestCreationModalData,
            })
            .closed.pipe(map(confirmed => ({ confirmed, request })))
        ),
        switchMap(({ confirmed, request }) => {
          if (confirmed) return of(null);
          return this.feedbackRequestsService.delete(request['@id']);
        }),
      )
      .subscribe(() => {
        this.router.navigate(['profile']);
      });
  }

  setSelectedSkills(skills: string[]): void {
    this.selectedSkills = skills;
  }
}
