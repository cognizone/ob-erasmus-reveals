import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ob-erasmus-reveal-app-logo',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule, RouterModule],
  templateUrl: './app-logo.component.html',
  styleUrls: ['./app-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogoComponent {}
