import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService, UserPromptService } from '@app/core';
import { LoadingService, Logger, OnDestroy$ } from '@cognizone/ng-core';
import { Router } from '@angular/router';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'ob-erasmus-reveal-signup',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ReactiveFormsModule, MatProgressBarModule],
  providers: [LoadingService],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent extends OnDestroy$ {
  @Input()
  isLogin: boolean = false;
  loading$: Observable<boolean> = this.loadingService.loading$;
  userEmail = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private authService: AuthService,
    private dialog: Dialog,
    private router: Router,
    private loadingService: LoadingService,
    private userPrompt: UserPromptService,
    private transloco: TranslocoService,
    private logger: Logger,
    @Optional() public dialogRef?: DialogRef
  ) {
    super();
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.userEmail.get('email')?.invalid && this.userEmail.get('email')?.touched) {
      const email = this.userEmail.getRawValue().email as string;

      if (this.isLogin) {
        this.subSink = this.authService
          .login(email)
          .pipe(
            this.loadingService.asOperator(),
            switchMap(userValid => {
              if (userValid) return this.authService.signin().pipe(this.loadingService.asOperator());
              return of(null);
            })
          )
          .subscribe(
            userValid => {
              if (userValid) this.userPrompt.success('login.check_email');
              else {
                this.userPrompt.error(this.transloco.translate('login.no_user_found'));
                this.logger.error('User not found');
              }
            },
            error => {
              this.userPrompt.error();
              this.logger.error(error);
            }
          );
      } else {
        this.subSink = this.authService
          .userExists(email)
          .pipe(
            switchMap(userExists => {
              if (!userExists) {
                return this.authService.register(email).pipe(this.loadingService.asOperator());
              }
              return of(null);
            })
          )
          .subscribe(
            user => {
              if (user) {
                this.dialogRef?.close();
                this.dialog.open(ConfirmationDialogComponent, {
                  data: { email },
                });
              } else {
                this.userPrompt.error('join_now.user_exists');
                this.logger.error('User already exists');
              }
            },
            error => {
              this.userPrompt.error();
              this.logger.error(error);
            }
          );
      }
    }
  }
}
