import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

import { faker } from '@faker-js/faker';
import { User, Feedback, DataFile, Country, Skill, RelationshipType } from '../apps/ob-erasmus-reveal/src/app/core/models';
import { getRandomInt } from '../apps/ob-erasmus-reveal/src/app/core/utils';
import { notNil } from '@cognizone/model-utils';

const basePath = 'apps/ob-erasmus-reveal/src/assets';

const countries = readJson<DataFile<Country>>('data/countries.json');
const skills = readJson<DataFile<Skill>>('data/skills.json');
const relationships = readJson<DataFile<RelationshipType>>('data/relationship-types.json');

const users: User[] = Array.from({ length: 1000 }).map(() => {
  return {
    '@id': `http://reveal.org/data/user/${faker.datatype.uuid()}`,
    '@type': 'User',
    country: getRandomInArray(countries.data)?.['@id'],
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
});

const feedbacks: Feedback[] = Array.from({ length: 10_000 })
  .map(() => {
    const fromUser: User = getRandomInArray(users)!;
    let toUser: User = getRandomInArray(users)!;
    if (fromUser === toUser) return;

    const skillNumber = getRandomInt(1, skills.data.length - 1);
    const endorsedSkills = Array.from({ length: skillNumber }).map(() => getRandomInArray(skills.data)?.['@id']);
    return {
      '@id': `http://reveal.org/data/feedback/${faker.datatype.uuid()}`,
      '@type': 'Feedback',
      '@facets': {
        requestingUser: toUser['@id'],
        requestingUserCountry: toUser.country,
      },
      endorsedSkills: Array.from(new Set(endorsedSkills)),
      fromCountry: fromUser.country,
      fromEmail: fromUser.email,
      fromFirstName: fromUser.firstName,
      fromLastName: fromUser.lastName,
      // TODO regenerate when relationships are merged on main
      relationshipType: getRandomInArray(relationships.data)?.['@id'],
      request: undefined, // TODO
      text: faker.lorem.text(),
    } as Feedback;
  })
  .filter(notNil);

writeJson('data/users.json', { data: users });
writeJson('data/feedbacks.json', { data: feedbacks });

function getRandomInArray<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined as T;
  return arr[getRandomInt(0, arr.length - 1)];
}

function writeJson(partialPath: string, content: {}): void {
  const stringContent = prettier.format(JSON.stringify(content), { parser: 'json' });
  fs.writeFileSync(path.join(basePath, partialPath), stringContent, 'utf8');
}

function readJson<T>(partialPath: string): T {
  return JSON.parse(fs.readFileSync(path.join(basePath, partialPath), 'utf-8')) as T;
}
