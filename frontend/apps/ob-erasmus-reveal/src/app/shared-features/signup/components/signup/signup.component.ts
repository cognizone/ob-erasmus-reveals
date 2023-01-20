import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService, UserPromptService } from '@app/core';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'ob-erasmus-reveal-signup',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ReactiveFormsModule, MatProgressBarModule],
  providers: [LoadingService],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent extends OnDestroy$ {
  @Input()
  isLogin: boolean = false;
  loading$: Observable<boolean> = this.loadingService.loading$
  userEmail = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  constructor(
    private authService: AuthService,
    private dialog: Dialog,
    private router: Router,
    private loadingService: LoadingService,
    private userPrompt: UserPromptService
  ) {
    super();
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.userEmail.get('email')?.invalid && this.userEmail.get('email')?.touched) {
      const email = this.userEmail.getRawValue().email as string;

      if (this.isLogin) {
        this.subSink = this.authService.login(email).pipe(this.loadingService.asOperator()).subscribe(userValid => {
          if (userValid) this.router.navigate(['profile']);
        })
      } else {
        this.subSink = this.authService.register(email)
        .pipe(this.loadingService.asOperator()).subscribe(() => {
          this.dialog
          .open(ConfirmationDialogComponent, {
            data: { email },
          })
        }, () => {
          this.userPrompt.error();
        })
      }
    }
  }
}
