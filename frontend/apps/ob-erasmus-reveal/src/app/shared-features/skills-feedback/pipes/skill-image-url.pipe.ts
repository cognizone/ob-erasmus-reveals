import { Pipe, PipeTransform } from '@angular/core';
import { Skill } from '@app/core';

@Pipe({
  name: 'skillImageUrl',
  standalone: true
})
export class SkillImageUrlPipe implements PipeTransform {
  transform(value: Skill | string): string {
    const uri = typeof value === 'string' ? value : value['@id'];
    return `assets/images/skills/${uri.split('/').pop()}.png`;
  }
}
