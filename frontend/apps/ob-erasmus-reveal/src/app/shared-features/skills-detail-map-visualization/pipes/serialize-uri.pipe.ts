import { Pipe, PipeTransform } from '@angular/core';
import { EncodeUriService } from '@app/core';
import { JsonModel } from '@cognizone/json-model';

@Pipe({
  name: 'serializeUri',
  standalone: true
})
export class SerializeUriPipe implements PipeTransform {
  constructor(private encodeUriService: EncodeUriService) {}

  transform(value: string | JsonModel): string {
    return this.encodeUriService.encode(value);
  }
}
