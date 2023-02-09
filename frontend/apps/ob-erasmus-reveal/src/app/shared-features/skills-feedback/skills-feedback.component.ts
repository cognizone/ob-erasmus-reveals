import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Skill } from '@app/core';
import produce from 'immer';
import { MatIconModule } from '@angular/material/icon';
import { SkillImageUrlPipe } from './pipes/skill-image-url.pipe';
import { I18nModule, I18nService } from '@cognizone/i18n';
import { OnDestroy$ } from '@cognizone/ng-core';

@Component({
  selector: 'ob-erasmus-reveal-skills-feedback',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule, MatIconModule, SkillImageUrlPipe, I18nModule],
  templateUrl: './skills-feedback.component.html',
  styleUrls: ['./skills-feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsFeedbackComponent extends OnDestroy$ implements OnInit {
  @Input()
  skills: Skill[] = [];
  @Input()
  skillUris?: string[];

  @Output()
  skillsSelected: EventEmitter<string[]> = new EventEmitter();
  selectedSkills: string[] = [];
  lang?: string;

  constructor(private i18nService: I18nService, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.subSink = this.i18nService.selectActiveLang().subscribe(lang => {
      this.lang = lang ?? undefined;
      this.cdr.markForCheck();
    });

    if (this.skillUris && (this.skillUris?.length ?? 0) > 0) {
      this.selectedSkills = this.skillUris;
    }
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
    this.skillsSelected.emit(this.selectedSkills);
  }

  isSelected(skill: Skill): boolean {
    return this.selectedSkills.includes(skill['@id']);
  }
}
