import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'ob-erasmus-reveal-sign-up-modal',
  standalone: true,
  imports: [CommonModule, TranslocoModule, RouterModule, NgOptimizedImage, SignupComponent],
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpModalComponent {}
