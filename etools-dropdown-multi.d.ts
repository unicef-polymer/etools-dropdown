// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';

import {CommonFunctionality} from './mixins/common-mixin.js';

import {MissingOptions} from './mixins/missing-options-mixin.js';

import {timeOut} from '@polymer/polymer/lib/utils/async.js';

import EtoolsLogsMixin from 'etools-behaviors/etools-logs-mixin.js';

/**
 * `etools-dropdown-multi`
 */
declare class EtoolsDropdownMulti extends MissingOptions(CommonFunctionality(
  EtoolsLogsMixin(PolymerElement))) {

  /**
   * Dropdown selected values
   */
  selectedValues: any[]|null|undefined;

  /**
   * Selected options objects
   */
  selectedItems: any[]|null|undefined;

  /**
   * Array of not found values (in options list)
   */
  notFoundOptions: any[]|null|undefined;

  /**
   * Element title attribute
   */
  readonly title: string|null|undefined;
  connectedCallback(): void;
  _selectedValuesOrOptionsChanged(selectedValuesOrLength: any, options: any): void;

  /**
   * Can't use paper-listbox's on-selected-items-changed event ,
   * because paper-lisbox doesn't cover the case when selectedItems are not in the shownOptions values
   */
  _setSelectedItems(selectedValues: any[]|null): void;
  _selectedItemsChanged(selectedItems: any): void;
  _fireChangeEvent(): void;
  _setAnyNotFoundOptions(selectedItems: any, selectedValues: any): void;
  _removeSelectedItem(e: any): void;

  /**
   * This observer makes sure request for missing option is triggered only after the url is set also.
   * notFoundOption is actually this.selected
   */
  _notFoundOptionsAndUrlChanged(notFoundOptions: any, url: any): void;
  _handleSelectedNotFoundInOptions(notFoundSelectedValues: any): void;
  _onDropdownClose(): void;

  /**
   * Validate multi selection
   */
  validate(selectedValues?: any): boolean;
  _getValuesFromItems(selectedItems: any): any;
  _noSelectedValues(selectedValues: any): any;
  _noSelectedItems(selectedItems: any): any;
  _selectedValuesToString(): void;
  _getElementTitle(selectedItems: any): any;
}

export {EtoolsDropdownMulti as EtoolsDropdownMultiEl}

declare global {

  interface HTMLElementTagNameMap {
    "etools-dropdown-multi": EtoolsDropdownMulti;
  }
}
