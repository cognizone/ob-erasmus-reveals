// simulating a generated interface file for now

import { JsonModel, JsonModelType } from '@cognizone/json-model';
import { LangString } from '@cognizone/model-utils';
import { FeedbackFacets } from './feedback.facets';
import { FeedbackRequestFacets } from './feedback-request.facets';
import { Color } from './color';

export interface Country extends JsonModel {
  '@type': JsonModelType<'Country'>;
  prefLabel?: LangString;
}

export interface Feedback extends JsonModel {
  '@type': JsonModelType<'Feedback'>;
  '@facets'?: FeedbackFacets;
  created?: string;
  endorsedSkills?: string[];
  fromCountry?: string;
  fromEmail?: string;
  fromFirstName?: string;
  fromLastName?: string;
  relationshipType?: string;
  request?: string;
  text?: string;
}

export interface FeedbackRequest extends JsonModel {
  '@type': JsonModelType<'FeedbackRequest'>;
  '@facets'?: FeedbackRequestFacets;
  emails?: string[];
  message?: string;
  skills?: string[];
  user: string;
}

export interface RelationshipType extends JsonModel {
  '@type': JsonModelType<'RelationshipType'>;
  prefLabel?: LangString;
}

export interface Skill extends JsonModel {
  '@type': JsonModelType<'Skill'>;
  description?: LangString;
  prefLabel?: LangString;
  quote?: LangString;
  label: Color;
  itemStyle: Color;
}

export interface User extends JsonModel {
  '@type': JsonModelType<'User'>;
  country?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}
