import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthService } from '@app/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MyProfileHeaderComponent } from '@app/shared-features/my-profile-header';
import { MyProfileFooterComponent } from '@app/shared-features/my-profile-footer';

@Component({
  selector: 'ob-erasmus-reveal-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MyProfileHeaderComponent,
    NgOptimizedImage,
    RouterModule,
    MatIconModule,
    MyProfileFooterComponent,
  ],
  templateUrl: './my-profile.view.html',
  styleUrls: ['./my-profile.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileView {
  constructor(public authService: AuthService) {}
}
