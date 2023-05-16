import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { I18nService } from '@cognizone/i18n';

@Component({
  selector: 'ob-erasmus-reveal-eu-logo',
  standalone: true,
  imports: [CommonModule, TranslocoModule, NgOptimizedImage],
  templateUrl: './eu-logo.component.html',
  styleUrls: ['./eu-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EuLogoComponent {
  public i18nService = inject(I18nService);
}
