import { Feedback } from '@app/core';

export interface ChartMetaData {
  lastEndorsedBy?: Feedback;
  endorsementCount: number;
  skillUri: string;
  feedbacks?: Feedback[],
  description: string;
  name: string;
}