import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, EmailService, FeedbackRequest, FeedbackRequestsService } from '@app/core';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import produce from 'immer';
import { combineLatest } from 'rxjs';

// TODO finish the component

@Component({
  selector: 'ob-erasmus-reveal-feedback-request-creation-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslocoModule, ReactiveFormsModule, TextFieldModule, ClipboardModule],
  providers: [LoadingService],
  templateUrl: './feedback-request-creation.modal.html',
  styleUrls: ['./feedback-request-creation.modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackRequestCreationModal extends OnDestroy$ implements OnInit {
  currentTabMode: TabMode = 'email';
  tabs: Tab[] = [
    {
      mode: 'email',
      icon: 'mail',
    }/*,
    {
      mode: 'link',
      icon: 'link',
    },*/
  ];

  form: FormGroup = this.fb.group({
    emails: ['', this.getEmailsValidator()],
    message: [this.transloco.translate('feedback_request.creation_modal.default_message')],
  });
  loading: boolean = false;

  /*get link(): string {
    // TODO real link
    return this.data.feedbackRequest['@id'];
  }*/

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private transloco: TranslocoService,
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) private data: FeedbackRequestCreationModalData,
    private feedbackRequestsService: FeedbackRequestsService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private emailService: EmailService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subSink = this.loadingService.loading$.subscribe(loading => {
      this.loading = loading;
      this.cdr.markForCheck();
    });
  }

  sendEmail(): void {
    const updatedRequest = produce(this.data.feedbackRequest, draft => {
      draft.emails = this.form.value.emails.split(',').map((email: string) => email.trim());
      draft.message = this.form.value.message;
    });

    this.subSink = combineLatest([this.feedbackRequestsService.save(updatedRequest), this.emailService.sendFeedbackRequest(updatedRequest)])
      .pipe(this.loadingService.asOperator())
      .subscribe(() => this.dialogRef.close(true));
  }

  private getEmailsValidator(): ValidatorFn {
    return (ctrl: AbstractControl<string>) => {
      const value = ctrl.value?.trim();
      if (!value) return { required: true };
      const emails = value
        .split(',')
        .map(email => email.trim())
        .filter(email => !!email);
      if (!emails.length) return { required: true };

      return emails.every(email => Validators.email(this.fb.control([email]))) ? { email: true } : null;
    };
  }
}

export interface FeedbackRequestCreationModalData {
  feedbackRequest: FeedbackRequest;
}

type TabMode = 'email' | 'link';

interface Tab {
  mode: TabMode;
  icon: string;
}
