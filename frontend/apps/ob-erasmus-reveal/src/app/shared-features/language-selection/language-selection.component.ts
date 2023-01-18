import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '@cognizone/i18n';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LanguageService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'ob-erasmus-reveal-language-selection',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ReactiveFormsModule],
  templateUrl: './language-selection.component.html',
  styleUrls: ['./language-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectionComponent extends OnDestroy$ implements OnInit {
  langFormControl: UntypedFormControl = this.fb.control(this.translocoService.getActiveLang());
  constructor(public i18nService: I18nService, public languageService: LanguageService, private cdr: ChangeDetectorRef, private fb: UntypedFormBuilder, private translocoService: TranslocoService) {
    super();
  }

  ngOnInit(): void {
    this.subSink = this.i18nService.selectActiveLang().subscribe(() => {
      this.cdr.markForCheck();
    });

    this.subSink = this.langFormControl.valueChanges.subscribe(lang => {
      this.languageService.setActiveLang(lang);
    })
  }
}
