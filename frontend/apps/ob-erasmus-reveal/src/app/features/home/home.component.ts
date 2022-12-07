import { ChangeDetectionStrategy, Component } from '@angular/core';
import { I18nService } from '@cognizone/i18n';
import { InformativeSection  } from '@app/core';

@Component({
  selector: 'ob-erasmus-reveal-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  targets: InformativeSection[] = [
    {
      'imgAlt': 'target_1.image_alt',
      'heading': 'target_1.label',
      'imgSrc': 'assets/images/icon-svgs/icon-view.svg',
      'content': 'target_1.description',
      'imgWidth': '39',
      'imgHeight': '31'
    },
    {
      'imgAlt': 'target_2.image_alt',
      'heading': 'target_2.label',
      'imgSrc': 'assets/images/icon-svgs/icon-rating.svg',
      'content': 'target_2.description',
      'imgWidth': '33',
      'imgHeight': '33'
    },
    {
      'imgAlt': 'target_3.image_alt',
      'heading': 'target_3.label',
      'imgSrc': 'assets/images/icon-svgs/icon-award.svg',
      'content': 'target_3.description',
      'imgWidth': '39',
      'imgHeight': '39'
    }
  ]
  constructor(public i18nService: I18nService) {}
}
