import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InformativeSection  } from '@app/core';
import { GettingStartedComponent } from '../components/getting-started/getting-started.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'ob-erasmus-reveal-profile-complete',
  templateUrl: './complete-profile.view.html',
  styleUrls: ['./complete-profile.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteProfileView {
  information: InformativeSection[] = [
    {
      'imgAlt': 'information.point_1.label',
      'heading': 'information.point_1.label',
      'imgSrc': 'assets/images/icon-svgs/icon-fullcircle-smile_purple.svg',
      'content': 'information.point_1.description',
      'imgWidth': '52',
      'imgHeight': '52'
    },
    {
      'imgAlt': 'information.point_2.label',
      'heading': 'information.point_2.label',
      'imgSrc': 'assets/images/icon-svgs/icon-fullcircle-tools.svg',
      'content': 'information.point_2.description',
      'imgWidth': '52',
      'imgHeight': '52'
    },
    {
      'imgAlt': 'information.point_3.label',
      'heading': 'information.point_3.label',
      'imgSrc': 'assets/images/icon-svgs/icon-fullcircle-people.svg',
      'content': 'information.point_3.description',
      'imgWidth': '52',
      'imgHeight': '52'
    }
  ]

  constructor(private dialog: Dialog) {}

  onClick(): void {
    this.dialog.open(GettingStartedComponent, {
      disableClose: true
    })
  }
}

