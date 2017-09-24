import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objtoarray'
})
export class ObjtoarrayPipe implements PipeTransform {

  transform(value: any, args?: any[]): Object[] {
    let groupedResult = [];
    Object.keys(value).forEach(function(key, index) {
      groupedResult[index] = {key: key, value: value[key]};
    });
    return groupedResult;
  }

}
