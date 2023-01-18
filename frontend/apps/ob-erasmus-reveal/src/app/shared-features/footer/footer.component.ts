import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { SignupComponent } from '../signup';

@Component({
  selector: 'ob-erasmus-reveal-footer',
  standalone: true,
  imports: [CommonModule, TranslocoModule, NgOptimizedImage, SignupComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  year: number = new Date().getFullYear();

  discoverItems: NavItem[] = [
    {
      labelKey: 'global.about',
      path: '/about',
    },
    {
      labelKey: 'global.about_tags',
      path: '/about',
    },
    {
      labelKey: 'footer.help',
      path: '/about',
    },
  ];

  socialMedia: NavItem[] = [
    {
      labelKey: 'footer.social_media.facebook',
      path: '#',
    },
    {
      labelKey: 'footer.social_media.twitter',
      path: '#',
    },
    {
      labelKey: 'footer.social_media.linkedin',
      path: '#',
    },
  ];
}

interface NavItem {
  labelKey: string,
  path: string,
  className?: string;
}
