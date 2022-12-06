import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ob-erasmus-reveal-join-now',
  templateUrl: './join-now.component.html',
  styleUrls: ['./join-now.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinNowComponent {
  points: Point[] = [...new Array(4)].map((k, index) => ({ label: `action_points.point_${index + 1}` }));
}

interface Point {
  label: string
}