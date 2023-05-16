import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { CdkMenuModule } from '@angular/cdk/menu';
import { I18nService } from '@cognizone/i18n';
import { LanguageService } from '@app/core';
import { MatIconModule } from '@angular/material/icon';
import { OnDestroy$ } from '@cognizone/ng-core';
import { EuLogoComponent } from '../../eu-logo';

@Component({
  selector: 'ob-erasmus-reveal-profile-footer',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule, RouterModule, CdkMenuModule, MatIconModule, EuLogoComponent],
  templateUrl: './profile-footer.component.html',
  styleUrls: ['./profile-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFooterComponent extends OnDestroy$ implements OnInit {
  @Input()
  isNotEndorsed: boolean = false;
  year: number = new Date().getFullYear();
  constructor(public i18nService: I18nService, public languageService: LanguageService, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.subSink = this.i18nService.selectActiveLang().subscribe(() => this.cdr.markForCheck());
  }
}
