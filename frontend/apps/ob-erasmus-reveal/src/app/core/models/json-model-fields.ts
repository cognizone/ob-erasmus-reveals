import { JsonModel } from '@cognizone/json-model';

export type JsonModelFields<T extends JsonModel> = Omit<T, '@id' | '@type' | '@context' | '@facets'>;
