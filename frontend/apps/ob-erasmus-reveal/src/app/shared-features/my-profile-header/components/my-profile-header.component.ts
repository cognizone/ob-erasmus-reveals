import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ob-erasmus-reveal-my-profile-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule, RouterModule, CdkMenuModule, MatIconModule],
  templateUrl: './my-profile-header.component.html',
  styleUrls: ['./my-profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileHeaderComponent {
  header: Items[] = [
    {
      'label': 'my_profile_header.heading',
      'path': '/my-profile'
    },
    {
      'label': 'my_profile_header.skills',
      'path': '/global-skills' // TODO should not be global skills
    },
    {
      'className': 'my-primary-button',
      'label': 'my_profile_header.ask_endorsement',
      'path': '/feedback-request/create'
    }
  ]
}

interface Items {
  className?: string,
  label: string,
  path: string,
}
