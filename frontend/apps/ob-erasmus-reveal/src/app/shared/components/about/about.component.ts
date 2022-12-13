import { ChangeDetectionStrategy, Component } from '@angular/core';
import { I18nService } from '@cognizone/i18n';

@Component({
  selector: 'ob-erasmus-reveal-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  constructor(public i18nService: I18nService) {}
}
