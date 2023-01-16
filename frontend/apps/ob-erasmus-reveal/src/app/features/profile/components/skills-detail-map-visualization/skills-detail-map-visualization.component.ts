import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CountriesMapComponent } from '@app/shared-features/countries-map';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { SkillImageUrlPipe } from '@app/shared-features/skills-feedback/pipes/skill-image-url.pipe';
import { RelationshipType, RelationshipTypeService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';
import { I18nService } from '@cognizone/i18n';
import { LangString } from '@cognizone/model-utils';

@Component({
  selector: 'ob-erasmus-reveal-skills-detail-map-visualization',
  standalone: true,
  imports: [CommonModule, CountriesMapComponent, MatIconModule, TranslocoModule, SkillImageUrlPipe, NgOptimizedImage],
  templateUrl: './skills-detail-map-visualization.component.html',
  styleUrls: ['./skills-detail-map-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsDetailMapVisualizationComponent extends OnDestroy$ implements OnInit {
  relation!: Relation[];
  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: any,
    private relationshipTypeService: RelationshipTypeService,
    private cdr: ChangeDetectorRef,
    private i18nService: I18nService
  ) {
    super();
  }

  ngOnInit() {
    this.subSink = this.relationshipTypeService.getAll().subscribe(relations => {
      this.relation = Object.assign({}, ...relations.map(r => {
        return {
          [r['@id']]: this.i18nService.czLabelToString(r.prefLabel as LangString)
        }
      }));
      this.cdr.markForCheck();
    })
  }
}

interface Relation {
  [uri: string]: RelationshipType
}
