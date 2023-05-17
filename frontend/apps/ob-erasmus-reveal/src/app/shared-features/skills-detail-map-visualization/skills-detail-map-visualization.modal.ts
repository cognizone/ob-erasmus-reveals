import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Counts, RelationshipTypeService, User } from '@app/core';
import { CountriesMapComponent } from '@app/shared-features/countries-map';
import { ChartMetaData, SkillUsersService } from '@app/shared-features/meta-visualization';
import { SkillImageUrlPipe } from '@app/shared-features/skills-feedback';
import { I18nService } from '@cognizone/i18n';
import { LangString } from '@cognizone/model-utils';
import { OnDestroy$ } from '@cognizone/ng-core';
import { TranslocoModule } from '@ngneat/transloco';
import { combineLatest } from 'rxjs';

import { SerializeUriPipe } from './pipes/serialize-uri.pipe';

@Component({
  selector: 'ob-erasmus-reveal-skills-detail-map-visualization',
  standalone: true,
  imports: [
    CommonModule,
    CountriesMapComponent,
    MatIconModule,
    TranslocoModule,
    SkillImageUrlPipe,
    NgOptimizedImage,
    RouterModule,
    MatStepperModule,
    SerializeUriPipe,
  ],
  templateUrl: './skills-detail-map-visualization.modal.html',
  styleUrls: ['./skills-detail-map-visualization.modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsDetailMapVisualizationModal extends OnDestroy$ implements OnInit {
  relation!: Relation;
  users: User[] = [];

  userCountPerSkill: number = 0;
  countriesPerSkill!: string[];
  currentIndex: number = 0;
  data?: ChartMetaData;
  selectedCountryUri?: string;
  displayEndorsementButton?: boolean;
  private authService = inject(AuthService);

  constructor(
    public dialogRef: DialogRef,
    private relationshipTypeService: RelationshipTypeService,
    private cdr: ChangeDetectorRef,
    private i18nService: I18nService,
    private router: Router,
    private skillUsersService: SkillUsersService
  ) {
    super();
  }

  ngOnInit() {
    this.subSink = combineLatest([
      this.skillUsersService.selectedUris$,
      this.skillUsersService.users$,
      this.skillUsersService.chartsData$,
    ]).subscribe(([uris, users, data]) => {
      this.users = users;
      this.selectedCountryUri = uris.selectedCountryUri;
      const selectedSkillUri = decodeURIComponent(uris.selectedSkillUri as string);
      this.data = data.find(d => d.metaData?.skillUri === selectedSkillUri)?.metaData;
      this.currentIndex = this.selectedCountryUri ? 1 : 0;
      this.cdr.markForCheck();
    });

    this.subSink = this.relationshipTypeService.getAll().subscribe(relations => {
      this.relation = relations.reduce(
        (a, b) => ({ ...a, [b['@id']]: this.i18nService.czLabelToString(b.prefLabel as LangString) || [] }),
        {}
      );
      this.cdr.markForCheck();
    });

    this.displayEndorsementButton = !!this.authService.currentUser;
  }

  onCountrySelected(country: string): void {
    // empty chart data on country selected.
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        selectedCountryUri: encodeURIComponent(country),
      },
    });
  }

  onUserCountryCountComputed(counts: Counts): void {
    this.countriesPerSkill = Object.keys(counts);
    if (this.countriesPerSkill.length > 0) {
      this.userCountPerSkill = Object.values(counts).reduce((a, b) => a + b);
    }
  }

  onClick(): void {
    // make sure to close the dialog
    this.dialogRef.close();
  }

  onClose(): void {
    // make sure to close the dialog
    this.dialogRef.close();
    this.router.navigate([], { queryParams: {} });
  }

  goToPreviousStep(): void {
    // removing the country uri to make sure the click on country works fine back and forth
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        selectedCountryUri: null,
      },
    });
  }
}

interface Relation {
  [uri: string]: string;
}

interface Data {
  data: ChartMetaData;
  currentIndex: number;
  users?: User[];
}
