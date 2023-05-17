import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AuthService, TokenStorageService } from '@app/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { SkillsVisualizationComponent } from '@app/shared-features/skills-visualization';
import { ProfileHeaderComponent } from '@app/shared-features/profile-header';
import { HeaderComponent } from '@app/shared-features/header';
import { FooterComponent } from '@app/shared-features/footer';
import { ProfileFooterComponent } from '@app/shared-features/profile-footer';

@Component({
  selector: 'ob-erasmus-reveal-global-skills-visualization',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    SkillsVisualizationComponent,
    ProfileHeaderComponent,
    HeaderComponent,
    FooterComponent,
    ProfileFooterComponent,
  ],
  templateUrl: './global-skills-visualization.view.html',
  styleUrls: ['./global-skills-visualization.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSkillsVisualizationView implements OnInit {
  isConnected: boolean = false;
  private tokenStorageService = inject(TokenStorageService);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.currentUser && this.tokenStorageService.tokenParams) this.isConnected = true;
  }
}
