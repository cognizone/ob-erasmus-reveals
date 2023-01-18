import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SharedModule } from '@app/shared'; // TODO - Change the Signup component to standalone for future
import { AnswerSentComponent } from '../answer-sent/answer-sent.component';

@Component({
  selector: 'ob-erasmus-reveal-endorsement-complete',
  standalone: true,
  imports: [SharedModule, AnswerSentComponent],
  templateUrl: './endorsement-complete.component.html',
  styleUrls: ['./endorsement-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndorsementCompleteComponent {
  @Input()
  requestingUser!: string;
}
