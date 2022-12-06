import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ob-erasmus-reveal-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  targets: Target[] = [
    {
      'altLabel': 'target_1.image_alt',
      'label': 'target_1.label',
      'path': 'assets/images/icon-svgs/icon-view.svg',
      'description': 'target_1.description'
    },
    {
      'altLabel': 'target_2.image_alt',
      'label': 'target_2.label',
      'path': 'assets/images/icon-svgs/icon-rating.svg',
      'description': 'target_2.description'
    },
    {
      'altLabel': 'target_3.image_alt',
      'label': 'target_3.label',
      'path': 'assets/images/icon-svgs/icon-award.svg',
      'description': 'target_3.description'
    }
  ]

}

interface Target {
  altLabel: string;
  label: string;
  path: string;
  description: string;
}
