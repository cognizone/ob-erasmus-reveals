import { Counts, Feedback, Skill } from '@app/core';
import { LangString } from '@cognizone/model-utils';
import { I18nService } from '@cognizone/i18n';
import { ChartData } from '../models/chart-data';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ChartDataService {
  constructor(private i18nService: I18nService) {}

  generateData(skills: Skill[], feedback?: Feedback[], counts?: Counts): ChartData[] {
    return skills.map<ChartData>(skill => {
      return {
        symbolSize: (counts && counts?.[skill['@id']] < 3 ? 120 : 180) ?? skill.symbolSize, // TODO - make it dynamic, add more conditions using switch
        name: this.i18nService.czLabelToString(skill.prefLabel as LangString),
        value: this.i18nService.czLabelToString(skill.description as LangString),
        label: {
          show: true,
          fontSize: (counts && counts?.[skill['@id']] < 3 ? 12 : 16) ?? skill?.symbolSize > 140 ? 16 : 12,
          fontWeight: 600,
          color: skill.label.color
        },
        itemStyle: {
          color: skill.itemStyle.color
        },
        metaData: {
          lastEndorsedBy: feedback?.filter(f => f.endorsedSkills?.includes(skill['@id'])).sort((a, b) => new Date(a?.created as string).getTime() - new Date(b?.created as string).getTime()).pop(),
          feedbacks: feedback?.filter(f => f.endorsedSkills?.includes(skill['@id'])),
          skillUri: skill['@id'],
          endorsementCount: counts?.[skill['@id']] ?? 0,
          description: this.i18nService.czLabelToString(skill.description as LangString),
          name: this.i18nService.czLabelToString(skill.prefLabel as LangString),
        }
      };
    });
  }
}