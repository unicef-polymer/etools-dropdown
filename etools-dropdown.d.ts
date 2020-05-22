// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';

import {CommonFunctionality} from './mixins/common-mixin.js';

import {MissingOptions} from './mixins/missing-options-mixin.js';

import {timeOut} from '@polymer/polymer/lib/utils/async.js';

import EtoolsLogsMixin from '@unicef-polymer/etools-behaviors/etools-logs-mixin.js';


/**
 * `etools-dropdown`
 */
declare class EtoolsDropdown extends  MissingOptions(
  CommonFunctionality(
    EtoolsLogsMixin(PolymerElement))) {

  /**
   * Dropdown selected value `optionValue` prop of the selected option
   */
  selected: number|null|undefined;

  /**
   * Selected option object
   */
  selectedItem: object|null|undefined;

  /**
   * Selected value not found in options
   */
  notFoundOption: string|null|undefined;

  /**
   * Element title attribute
   */
  readonly title: string;
  _selectedAndOptionsChanged(selected: any, options: any): void;
  _setSelectedItem(selected: any, selectedItem: any): void;
  _getItemFromOptions(value: any): any;
  _notFoundOptionAndUrlChanged(notFoundOption: any, url: any): void;
  _handleSelectedNotFoundInOptions(selected: any): void;
  _onDropdownClose(): void;

  /**
   * Validate dropdown selection
   */
  validate(selected?: any): boolean;
  _selectedChanged(selected: any): void;
  _fireChangeEvent(): void;
}
export {EtoolsDropdown as EtoolsDropdownEl};

declare global {

  interface HTMLElementTagNameMap {
    "etools-dropdown": EtoolsDropdown;
  }
}
