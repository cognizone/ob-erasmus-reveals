import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { map, Observable } from 'rxjs';
import { SkillsService } from '@app/core';
import { I18nService } from '@cognizone/i18n';
import { LangString } from '@cognizone/model-utils';
import { Dialog } from '@angular/cdk/dialog';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';
import { OnDestroy$ } from '@cognizone/ng-core';

@Component({
  selector: 'ob-erasmus-reveal-skills-visualization',
  templateUrl: './skills-visualization.component.html',
  styleUrls: ['./skills-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsVisualizationComponent extends OnDestroy$ implements OnInit {
  options$!: Observable<EChartsOption>;

  constructor(private skillsService: SkillsService, private i18nService: I18nService, private dialog: Dialog) {
    super();
  }


  ngOnInit(): void {
    // Make sure to change the number in config.json when the skills.json is modified
    this.options$ = this.skillsService.getAll().pipe(
      map((data) => {
        return {
          tooltip: {
            className: 'my-tooltip',
            formatter: '<p class="my-tooltip-heading">{b0}</p> <p class="my-tooltip-description">{c0}</p>'
          },
          series: [
            {
              type: 'graph',
              layout: 'force',
              data: data.map(a => {
                return {
                  symbolSize: a.symbolSize,
                  //symbolSize: getRandomInt(120, 199), // maybe we hardcode this in the JSON for now , should be based on aggregation on global counts
                  name: this.i18nService.czLabelToString(a.prefLabel as LangString),
                  label: {
                    show: true,
                    fontSize: (a?.symbolSize as number) > 140 ? 16 : 12,
                    fontWeight: 600,
                    color: a.label.color
                  },
                  itemStyle: {
                    color: a.itemStyle.color
                  },
                  value: this.i18nService.czLabelToString(a.description as LangString),
                }
              }),
              force: {
                repulsion: 500,
              },
            },
          ],
        } as EChartsOption;
      }),
    );
  }
  // TODO - see if the movement of the charts on load can be controlled

  onChartClick(event: unknown): void {
    this.subSink = this.dialog.open(SignUpModalComponent).closed.subscribe(o => {
      // close the dialog(should close on join or even connect) and navigate to complete profile page from here;
    })
  }
}
