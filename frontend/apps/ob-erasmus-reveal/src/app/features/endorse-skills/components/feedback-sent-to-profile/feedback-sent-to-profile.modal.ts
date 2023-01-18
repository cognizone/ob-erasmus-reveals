import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AnswerSentComponent } from '../answer-sent/answer-sent.component';

@Component({
  selector: 'ob-erasmus-reveal-feedback-sent-to-profile',
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatIconModule, AnswerSentComponent],
  templateUrl: './feedback-sent-to-profile.modal.html',
  styleUrls: ['./feedback-sent-to-profile.modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackSentToProfileModal {
  constructor(public dialogRef: DialogRef, @Inject(DIALOG_DATA) public data: RequestingUserModalData) {}
}

interface RequestingUserModalData {
  requestingUser: string
}
