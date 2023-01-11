import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ob-erasmus-reveal-answer-sent',
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatIconModule],
  templateUrl: './answer-sent.component.html',
  styleUrls: ['./answer-sent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerSentComponent {
  @Input()
  requestingUser!: string;
}
