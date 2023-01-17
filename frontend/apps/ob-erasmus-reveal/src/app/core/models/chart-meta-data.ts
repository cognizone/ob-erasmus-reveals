import { Feedback } from './reveal.ap';

export interface ChartMetaData {
  lastEndorsedBy?: Feedback;
  endorsementCount: number;
  skillUri: string;
  feedbacks: Feedback[],
  description: string;
  name: string;
}