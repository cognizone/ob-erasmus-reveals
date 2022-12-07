import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ob-erasmus-reveal-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectComponent {
  @Input()
  getStarted: boolean = false;
}
