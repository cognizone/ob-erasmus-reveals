import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Skill } from '@app/core';
import produce from 'immer';
import { MatIconModule } from '@angular/material/icon';
import { SkillImageUrlPipe } from './pipes/skill-image-url.pipe';
import { I18nModule } from '@cognizone/i18n';

@Component({
  selector: 'ob-erasmus-reveal-skills-feedback',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule, MatIconModule, SkillImageUrlPipe, I18nModule],
  templateUrl: './skills-feedback.component.html',
  styleUrls: ['./skills-feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsFeedbackComponent {
  @Input()
  skills: Skill[] = [];

  @Output()
  selectSkills: EventEmitter<string[]> = new EventEmitter();
  selectedSkills: string[] = [];

  toggleSelection(skill: Skill): void {
    const index = this.selectedSkills.findIndex(s => s === skill['@id']);
    this.selectedSkills = produce(this.selectedSkills, draft => {
      if (index >= 0) {
        draft.splice(index, 1);
      } else {
        draft.push(skill['@id']);
      }
    });
    this.selectSkills.emit(this.selectedSkills);
  }

  isSelected(skill: Skill): boolean {
    return this.selectedSkills.includes(skill['@id']);
  }
}
