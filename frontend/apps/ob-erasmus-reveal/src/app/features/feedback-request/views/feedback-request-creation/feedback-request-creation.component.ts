import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Skill, SkillsService } from '@app/core';
import { SkillImageUrlPipeModule } from '@app/shared/pipes';
import { I18nModule } from '@cognizone/i18n';
import { OnDestroy$ } from '@cognizone/ng-core';
import { TranslocoModule } from '@ngneat/transloco';
import produce from 'immer';

import { FeedbackRequestCreationModalComponent } from '../../components/feedback-request-creation-modal/feedback-request-creation-modal.component';

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
  ],
  templateUrl: './feedback-request-creation.component.html',
  styleUrls: ['./feedback-request-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackRequestCreationView extends OnDestroy$ implements OnInit {
  selectedSkills: string[] = [];
  skills: Skill[] = [];

  constructor(private skillsService: SkillsService, private cdr: ChangeDetectorRef, public dialog: Dialog) {
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
    // TODO create the item in DB before opening the modal
    // TODO remove the item from DB on cancel
    this.dialog.open<string>(FeedbackRequestCreationModalComponent, {
      data: { name: 'yo', animal: 'this.animal' },
    });
  }
}
