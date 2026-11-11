/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {Pipe, PipeTransform} from '@angular/core';

import {ApiItemType} from '../interfaces/api-item-type';

@Pipe({
  name: 'adevApiLabel',
  standalone: true,
})
export class ApiLabel implements PipeTransform {
  private readonly shortLabelsMap: Record<ApiItemType, string> = {
    [ApiItemType.BLOCK]: 'B',
    [ApiItemType.CLASS]: 'C',
    [ApiItemType.CONST]: 'K',
    [ApiItemType.DECORATOR]: '@',
    [ApiItemType.DIRECTIVE]: 'D',
    [ApiItemType.ELEMENT]: 'El',
    [ApiItemType.ENUM]: 'E',
    [ApiItemType.FUNCTION]: 'F',
    [ApiItemType.INTERFACE]: 'I',
    [ApiItemType.PIPE]: 'P',
    [ApiItemType.NG_MODULE]: 'M',
    [ApiItemType.TYPE_ALIAS]: 'T',
    [ApiItemType.INITIALIZER_API_FUNCTION]: 'IA',
  };

  private readonly fullLabelsMap: Record<ApiItemType, string> = {
    [ApiItemType.BLOCK]: '區塊',
    [ApiItemType.CLASS]: '類別',
    [ApiItemType.CONST]: '常數',
    [ApiItemType.DECORATOR]: '裝飾器',
    [ApiItemType.DIRECTIVE]: '指令',
    [ApiItemType.ELEMENT]: '元素',
    [ApiItemType.ENUM]: '列舉',
    [ApiItemType.FUNCTION]: '函式',
    [ApiItemType.INTERFACE]: '介面',
    [ApiItemType.PIPE]: '管道',
    [ApiItemType.NG_MODULE]: '模組',
    [ApiItemType.TYPE_ALIAS]: '型別別名',
    [ApiItemType.INITIALIZER_API_FUNCTION]: '初始化 API',
  };

  transform(value: ApiItemType, labelType: 'short' | 'full'): string {
    return labelType === 'full' ? this.fullLabelsMap[value] : this.shortLabelsMap[value];
  }
}
