import { Counts, Feedback, Skill } from '@app/core';
import { LangString } from '@cognizone/model-utils';
import { I18nService } from '@cognizone/i18n';
import { ChartData } from '@app/shared-features/meta-visualization';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChartDataService {
  constructor(private i18nService: I18nService) {}

  generateData(skills: Skill[], counts?: Counts, feedback?: Feedback[]): ChartData[] {
    const maxCount = Object.values(counts ?? {}).reduce((a, b) => Math.max(a, b), 0);
    return skills.map<ChartData>(skill => {
      const count = counts?.[skill['@id']] ?? 0;
      const size = 120 + (count / maxCount) * 60;
      return {
        symbolSize: size,
        name: this.i18nService.czLabelToString(skill.prefLabel as LangString),
        value: this.i18nService.czLabelToString(skill.description as LangString),
        label: {
          show: true,
          fontSize: count < 3 ? 12 : 16,
          fontWeight: 600,
          color: skill.label.color,
        },
        itemStyle: {
          color: skill.itemStyle.color,
        },
        metaData: {
          lastEndorsedBy: feedback
            ?.filter(f => f.endorsedSkills?.includes(skill['@id']))
            .sort((a, b) => new Date(a?.created as string).getTime() - new Date(b?.created as string).getTime())
            .pop(),
          feedbacks: feedback?.filter(f => f.endorsedSkills?.includes(skill['@id'])),
          skillUri: skill['@id'],
          endorsementCount: counts?.[skill['@id']] ?? 0,
          description: this.i18nService.czLabelToString(skill.description as LangString),
          name: this.i18nService.czLabelToString(skill.prefLabel as LangString),
        },
      };
    });
  }
}
