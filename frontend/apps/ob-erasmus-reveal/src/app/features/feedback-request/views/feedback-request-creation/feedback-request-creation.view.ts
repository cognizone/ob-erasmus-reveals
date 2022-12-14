import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FeedbackRequestsService, Skill, SkillsService } from '@app/core';
import { SkillImageUrlPipeModule } from '@app/shared/pipes';
import { I18nModule } from '@cognizone/i18n';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { TranslocoModule } from '@ngneat/transloco';
import produce from 'immer';
import { map, of, switchMap } from 'rxjs';

import {
  FeedbackRequestCreationModal,
  FeedbackRequestCreationModalData,
} from '../../components/feedback-request-creation/feedback-request-creation.modal';
import { MyProfileHeaderComponent } from '@app/shared-features/my-profile-header/components/my-profile-header.component';

// TODO not reachable from UI, to be plugged to profile page. Accessible manually trough http://localhost:4200/feedback-request/create.
// TODO hide global footer, but guessing this will be handled in general with connected users.

@Component({
  selector: 'ob-erasmus-reveal-feedback-request-creation',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    I18nModule,
    SkillImageUrlPipeModule,
    NgOptimizedImage,
    MatIconModule,
    RouterModule,
    DialogModule,
    MyProfileHeaderComponent
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
    public loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subSink = this.skillsService.getAll().subscribe(skills => {
      this.skills = skills;
      this.cdr.markForCheck();
    });
  }

  toggleSelection(skill: Skill): void {
    const index = this.selectedSkills.findIndex(s => s === skill['@id']);
    this.selectedSkills = produce(this.selectedSkills, draft => {
      if (index >= 0) {
        draft.splice(index, 1);
      } else {
        draft.push(skill['@id']);
      }
    });
  }

  isSelected(skill: Skill): boolean {
    return this.selectedSkills.includes(skill['@id']);
  }

  openModal(): void {
    this.subSink = this.feedbackRequestsService
      .createBase({ skills: this.selectedSkills })
      .pipe(
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
        this.loadingService.asOperator()
      )
      .subscribe(() => {
        // TODO go back to profile page
      });
  }
}
