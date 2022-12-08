import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '@app/core';

@Pipe({
  name: 'skillImageUrl',
})
export class SkillImageUrlPipe implements PipeTransform {
  transform(value: Skill | string): string {
    const uri = typeof value === 'string' ? value : value['@id'];
    return `assets/images/skills/${uri.split('/').pop()}.png`;
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [SkillImageUrlPipe],
  exports: [SkillImageUrlPipe],
})
export class SkillImageUrlPipeModule {}
