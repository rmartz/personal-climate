import { Pipe, PipeTransform } from '@angular/core';

/* Convert a space or underscore delimited string to be hyphen-delimited */
@Pipe({name: 'kebab'})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/[_ ]/g, '-');
  }
}
