/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   mixins/list-item-utils-mixin.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

export {ListItemUtils};


/**
 * Item data utils mixin
 */
declare function ListItemUtils<T extends new (...args: any[]) => {}>(base: T): T & ListItemUtilsConstructor;

interface ListItemUtilsConstructor {
  new(...args: any[]): ListItemUtils;
}

export {ListItemUtilsConstructor};

interface ListItemUtils {

  /**
   * Option object property to use as value for selection
   */
  optionValue: string|null|undefined;

  /**
   * Option object property to use as label
   */
  optionLabel: string|null|undefined;

  /**
   * Show option label on 2 lines
   */
  twoLinesLabel: boolean|null|undefined;

  /**
   * None option label
   */
  noneOptionLabel: string|null|undefined;

  /**
   * Capitalize selected values/option, UI only
   */
  capitalize: boolean|null|undefined;

  /**
   * Get option primary label. All chars until `|` .
   */
  getPrimaryLabel(label: any): string;

  /**
   * Get option secondary label. All chars after `|`
   */
  getSecondaryLabel(label: any): any;

  /**
   * Get current option value
   */
  getValue(item: any): null;

  /**
   * Get option label
   */
  getLabel(item: any): any;

  /**
   * Capitalize string
   */
  _capitalizeString(string: any): string;
}
