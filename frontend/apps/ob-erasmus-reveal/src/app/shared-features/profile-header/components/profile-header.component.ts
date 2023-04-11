import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@app/core';

@Component({
  selector: 'ob-erasmus-reveal-profile-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule, RouterModule, CdkMenuModule, MatIconModule],
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeaderComponent {
  authService = inject(AuthService);
  header: Items[] = [
    {
      display: !!this.authService.currentUser,
      label: 'profile_header.heading',
      path: '/profile',
    },
    {
      display: !!this.authService.currentUser,
      label: 'profile_header.skills',
      path: '/global-skills', // TODO should not be global skills
    },
    {
      className: 'my-primary-button',
      display: !!this.authService.currentUser,
      label: 'profile_header.ask_endorsement',
      path: '/feedback-request/create',
    },
  ];
}

interface Items {
  className?: string;
  display: boolean;
  label: string;
  path: string;
}
