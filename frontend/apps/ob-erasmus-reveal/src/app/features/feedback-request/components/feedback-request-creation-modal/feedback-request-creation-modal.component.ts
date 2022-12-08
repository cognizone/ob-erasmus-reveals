import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

// TODO finish the component

@Component({
  selector: 'ob-erasmus-reveal-feedback-request-creation-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslocoModule],
  templateUrl: './feedback-request-creation-modal.component.html',
  styleUrls: ['./feedback-request-creation-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackRequestCreationModalComponent {
  currentTabMode: TabMode = 'email';
  tabs: Tab[] = [
    {
      mode: 'email',
      icon: 'mail',
    },
    {
      mode: 'link',
      icon: 'link',
    },
  ];
}

type TabMode = 'email' | 'link';

interface Tab {
  mode: TabMode;
  icon: string;
}
