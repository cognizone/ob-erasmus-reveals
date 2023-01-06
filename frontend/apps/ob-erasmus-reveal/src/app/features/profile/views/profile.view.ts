import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthService } from '@app/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProfileHeaderComponent } from '@app/shared-features/profile-header';
import { ProfileFooterComponent } from '@app/shared-features/profile-footer';

@Component({
  selector: 'ob-erasmus-reveal-profile',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ProfileHeaderComponent,
    NgOptimizedImage,
    RouterModule,
    MatIconModule,
    ProfileFooterComponent,
  ],
  templateUrl: './profile.view.html',
  styleUrls: ['./profile.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileView {
  userInfo: string = `${this.authService.currentUser.firstName} ${this.authService.currentUser.lastName}` ?? this.authService.currentUser.email as string;
  constructor(public authService: AuthService) {}
}
