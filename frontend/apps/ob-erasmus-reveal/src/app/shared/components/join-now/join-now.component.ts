import { Component } from '@angular/core';

@Component({
    selector: 'ob-erasmus-reveal-join-now',
    templateUrl: './join-now.component.html',
    styleUrls: ['./join-now.component.scss'],
})
export class JoinNowComponent {
    points: point[] = [
        {
            "label": 'action_points.point_1'
        },
        {
            "label": 'action_points.point_2'
        },
        {
            "label": 'action_points.point_3'
        },
        {
            "label": 'action_points.point_4'
        }
    ]
}

interface point {
    label: string
}