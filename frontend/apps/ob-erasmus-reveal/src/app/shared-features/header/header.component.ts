import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LanguageService } from '@app/core';
import { I18nService } from '@cognizone/i18n';
import { OnDestroy$ } from '@cognizone/ng-core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CdkMenuModule } from '@angular/cdk/menu';
import { AppLogoComponent } from '../app-logo';

@Component({
  selector: 'ob-erasmus-reveal-header',
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatIconModule, RouterModule, CdkMenuModule, AppLogoComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends OnDestroy$ implements OnInit {
  constructor(public i18nService: I18nService, public languageService: LanguageService, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.subSink = this.i18nService.selectActiveLang().subscribe(() => this.cdr.markForCheck());
  }
}
