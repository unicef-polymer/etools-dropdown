import {LitElement, html, property} from 'lit-element';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import {CommonFunctionalityMixin} from './mixins/common-mixin.js';
import {MissingOptionsMixin} from './mixins/missing-options-mixin.js';
import {timeOut} from '@polymer/polymer/lib/utils/async.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import './scripts/es6-polyfills.js';
import './elements/selected-options.js';
import './elements/searchbox-input.js';
import './elements/options-list.js';
import {esmmSharedStyles} from './styles/esmm-shared-styles.js';
import {getTranslation} from './utils/translate';

/**
 * `etools-dropdown-multi`
 *
 * @polymer
 * @customElement
 * @appliesMixin MultiDropdownRequiredMixins
 * @demo demo/index-multi.html
 */
export class EtoolsDropdownMulti extends CommonFunctionalityMixin(MissingOptionsMixin(LitElement)) {
  /** Dropdown selected values */
  @property({type: Array}) // notify: true
  selectedValues: any[] = [];

  /** Selected options objects */
  @property({type: Array}) // notify: true
  selectedItems: any[] = [];

  @property({type: Array})
  prevSelectedItems: any[] = [];

  /** Array of not found values (in options list) */
  @property({type: Array})
  notFoundOptions: any[] = [];

  /** Element title attribute */
  @property({type: String, attribute: 'title', reflect: true})
  title = '';

  @property({type: String, attribute: 'close-text', reflect: true})
  closeText!: string;

  @property({type: String})
  language!: string;

  private _debouncer: Debouncer | null = null;

  render() {
    // language=HTML
    return html`
      ${esmmSharedStyles}
      <style>
        :host([hide-search]) #dropdown-controls {
          padding-top: 20px;
        }
        #dropdown-controls #searchbox {
          padding: 8px 16px;
          margin-bottom: -4px;
        }
        .close-btn {
          float: right;
          text-align: right;
          padding: 10px 16px;
          font-size: 12px;
          color: var(--primary-color);
          font-weight: 500;
          border-top: solid 1px lightgray;
          text-transform: uppercase;
          cursor: pointer;
        }
      </style>

      <esmm-selected-options
        id="main"
        .selectedItems="${this.selectedItems}"
        .label="${this.label}"
        .placeholder="${this.placeholder}"
        ?always-float-label="${this.alwaysFloatLabel}"
        ?no-label-float="${this.noLabelFloat}"
        ?two-lines-label="${this.twoLinesLabel}"
        ?capitalize="${this.capitalize}"
        ?readonly="${this.readonly}"
        ?disabled="${this.disabled}"
        ?invalid="${this.invalid}"
        .optionValue="${this.optionValue}"
        .optionLabel="${this.optionLabel}"
        .errorMessage="${this._getErrorMessage(this.errorMessage, this.invalid)}"
        .openMenu="${this._openMenu}"
        .onInputFocus="${this.onInputFocus}"
        exportparts="esmm-label-container, esmm-label, esmm-label-suffix"
      >
        <span slot="input-label-suffix">
          <slot name="label-suffix"></slot>
        </span>
      </esmm-selected-options>

      <iron-dropdown
        id="dropdownMenu"
        part="esmm-dropdownmenu"
        horizontal-align="${this.horizontalAlign}"
        ?dynamic-align="${!this.noDynamicAlign}"
        @iron-overlay-opened="${this._onDropdownOpen}"
        @iron-overlay-closed="${this._onDropdownClose}"
        ?disabled="${this._menuBtnIsDisabled(this.disabled, this.readonly)}"
        no-cancel-on-outside-click
        allow-click-through
        ?with-backdrop="${this.withBackdrop}"
      >
        <div
          id="ironDrContent"
          class="paper-material rounded"
          elevation="1"
          slot="dropdown-content"
          part="esmm-dropdown-content"
        >
          <div id="dropdown-controls">
            <esmm-searchbox-input
              id="searchbox"
              .search="${this.search}"
              @search-changed="${this._searchChanged}"
              .language="${this.language}"
              ?hidden="${this.hideSearch}"
            ></esmm-searchbox-input>
          </div>

          <esmm-options-list
            id="optionsList"
            .shownOptions="${this.shownOptions}"
            multi
            .selectedValues="${this.selectedValues}"
            @selected-values-changed="${this._selectedValuesChanged}"
            ?two-lines-label="${this.twoLinesLabel}"
            .optionValue="${this.optionValue}"
            .optionLabel="${this.optionLabel}"
            .requestInProgress="${this.requestInProgress}"
            .showNoSearchResultsWarning="${this.showNoSearchResultsWarning}"
            .showLimitWarning="${this.showLimitWarning}"
            .shownOptionsLimit="${this.shownOptionsLimit}"
            .shownOptionsCount="${this.shownOptionsLimit}"
            .noOptionsAvailable="${this.noOptionsAvailable}"
            ?capitalize="${this.capitalize}"
            @show-more="${this.onShowMore}"
            .language="${this.language}"
          >
          </esmm-options-list>
          <span
            title="${this._getCloseBtnText(this.closeText, this.language)}"
            class="close-btn"
            part="esmm-close-btn"
            ?hidden="${this.hideClose}"
            @tap="${this._closeMenu}"
          >
            ${this._getCloseBtnText(this.closeText, this.language)}
          </span>
        </div>
      </iron-dropdown>
    `;
  }

  updated(changedProperties: any) {
    super.updated(changedProperties);
    if (changedProperties.has('selectedValues') || changedProperties.has('options')) {
      this._selectedValuesOrOptionsChanged(this.selectedValues, this.options);
    }
    if (changedProperties.has('notFoundOptions') || changedProperties.has('url')) {
      this._notFoundOptionsAndUrlChanged(this.notFoundOptions, this.url);
    }
    if (changedProperties.has('selectedItems')) {
      this._selectedItemsChanged(this.selectedItems);
    }
  }

  // @ts-ignore
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('remove-selected-item', this._removeSelectedItem.bind(this));
    this._openMenu = this._openMenu.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
  }

  _selectedValuesOrOptionsChanged(selectedValuesOrLength: any, options: any[]) {
    if (this._isUndefined(selectedValuesOrLength) || this._isUndefined(options)) {
      return;
    }

    if (!this.selectedValues) {
      this.selectedValues = [];
    }

    // there is no current selection and we have no items already selected
    // return to prevent eager validation below in case we just re-render a dropdown without selection
    if (!this.selectedValues.length && !this.selectedItems.length) {
      return;
    }

    // when using dynamic data load, in case we load options data, must preserve selected item
    if (typeof this.loadDataMethod === 'function' && this.selectedItems.length) {
      const selectedItemsMissingInOptions = this.selectedItems.filter(
        (s) => !this.options.some((o: any) => String(o[this.optionValue]) === String(s[this.optionValue]))
      );

      if (selectedItemsMissingInOptions.length) {
        this.options = selectedItemsMissingInOptions.concat(this.options);
      }
    }
    this._selectedValuesToString();
    this._setSelectedItems(this.selectedValues);
    // elemAttached condition is to prevent eager validation
    if (this.autoValidate && this.elemAttached) {
      this.validate(this.selectedValues);
    }
  }

  /**
   * Can't use paper-listbox's on-selected-items-changed event ,
   * because paper-lisbox doesn't cover the case when selectedItems are not in the shownOptions values
   *
   * @param {Array} selectedValues
   */
  _setSelectedItems(selectedValues: any[]) {
    this.notFoundOptions = [];
    if (typeof selectedValues === 'undefined') {
      selectedValues = this.selectedValues;
    }
    if (this._noSelectedValues(selectedValues) && this._noOptions()) {
      this.selectedItems = [];
      return;
    }
    if (!this._noSelectedValues(selectedValues) && this._noOptions()) {
      this._setAnyNotFoundOptions(this.selectedItems, selectedValues);
      return;
    }

    const selectedItems = this.options.filter((item: any) => {
      return selectedValues instanceof Array && item[this.optionValue]
        ? selectedValues.includes(item[this.optionValue].toString())
        : false;
    });

    this._setAnyNotFoundOptions(selectedItems, selectedValues);
    this.selectedItems = selectedItems;
  }

  _selectedItemsChanged(selectedItems: any[]) {
    if (JSON.stringify(this.prevSelectedItems) !== JSON.stringify(selectedItems)) {
      this.prevSelectedItems = selectedItems;
      setTimeout(() => {
        this._setDropdownMenuVerticalOffset();
      }, 10);
    }

    if (this._isUndefined(selectedItems)) {
      return;
    }

    this.title = this._getElementTitle(this.selectedItems);

    // trigger items change event check
    if (!this.triggerValueChangeEvent) {
      return;
    }

    this._debouncer = Debouncer.debounce(this._debouncer, timeOut.after(10), () => {
      this._fireChangeEvent();
    });
  }

  /**
   * @event etools-selected-items-changed
   */
  _fireChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('etools-selected-items-changed', {
        detail: {selectedItems: this.selectedItems},
        bubbles: true,
        composed: true
      })
    );
  }

  _setAnyNotFoundOptions(selectedItems: any[], selectedValues: any[]) {
    // prevent using non array variables
    selectedItems = selectedItems instanceof Array ? selectedItems : [];
    selectedValues = selectedValues instanceof Array ? selectedValues : [];
    if (this._noSelectedItems(selectedItems)) {
      this.notFoundOptions = selectedValues;
    } else if (selectedItems.length < selectedValues.length) {
      const selectedItemsValues = this._getValuesFromItems(selectedItems);
      this.notFoundOptions = selectedValues.filter((value: any) => {
        return !selectedItemsValues.includes(value);
      });
    }
  }

  _removeSelectedItem(e: any) {
    // Compute selectedItems without the removed item
    const selectedItems = this.selectedItems.filter((item) => {
      return item[this.optionValue] !== e.detail;
    });

    if (this._noSelectedItems(selectedItems)) {
      this.selectedValues = [];
      this.selectedItems = [];
    } else {
      this.selectedValues = this._getValuesFromItems(selectedItems);
      this.selectedItems = selectedItems;
    }

    if (this.autoValidate) {
      this.validate(this.selectedValues);
    }
  }

  /**
   * This observer makes sure request for missing option is triggered only after the url is set also.
   * notFoundOption is actually this.selected
   */
  _notFoundOptionsAndUrlChanged(notFoundOptions: any[], url: string) {
    if (url && this.arrayIsNotEmpty(notFoundOptions)) {
      this._handleSelectedNotFoundInOptions(this.notFoundOptions);
    }
  }

  _handleSelectedNotFoundInOptions(notFoundSelectedValues: any[]) {
    this.requestMissingOptions(notFoundSelectedValues);
    // show warning
    let warnMsg = 'Selected value ';
    const notFoundValues =
      notFoundSelectedValues instanceof Array ? notFoundSelectedValues.join(', ') : notFoundSelectedValues;
    warnMsg += notFoundValues + " not found in dropdown's options!";
    console.log('etools-esmm ' + this.label + ': ' + warnMsg);
  }

  _onDropdownClose() {
    super._onDropdownClose();

    if (this.autoValidate) {
      this.validate(this.selectedValues);
    }
  }

  /**
   * Validate multi selection
   * @param selectedValues
   * @returns {boolean}
   */
  validate(selectedValues?: any[]) {
    if (!this.hasAttribute('required') || this.readonly) {
      this.invalid = false;
      return true;
    }

    if (typeof selectedValues === 'undefined') {
      selectedValues = this.selectedValues;
    }
    const invalid = !selectedValues || !selectedValues.length;
    this.invalid = invalid;
    return !invalid;
  }

  _getValuesFromItems(selectedItems?: any[]) {
    return selectedItems && selectedItems.length > 0
      ? selectedItems.map((item: any) => {
          return item[this.optionValue].toString();
        })
      : [];
  }

  _noSelectedValues(selectedValues?: any[]) {
    if (typeof selectedValues === 'undefined') {
      selectedValues = this.selectedValues;
    }
    return !selectedValues || !selectedValues.length;
  }

  _noSelectedItems(selectedItems?: any[]) {
    if (typeof selectedItems === 'undefined') {
      selectedItems = this.selectedItems;
    }
    return !selectedItems || !selectedItems.length;
  }

  _selectedValuesToString() {
    if (this._noSelectedValues(this.selectedValues)) {
      return;
    }
    this.selectedValues.forEach((value, index) => {
      if (value && typeof value !== 'string') {
        this.selectedValues[index] = value.toString();
      }
    });
  }

  _getElementTitle(selectedItems: any[]) {
    const labels = selectedItems.map((item) => {
      return this.getLabel(item);
    });

    return labels.join(' | ');
  }

  _getCloseBtnText(closeText: string, language: string) {
    if (closeText) {
      return closeText;
    }
    return getTranslation(language, 'CLOSE');
  }

  _searchChanged(e: CustomEvent) {
    this.search = e.detail.value;
    this.notifyDropdownResize();
  }

  _selectedValuesChanged(e: CustomEvent) {
    this.selectedValues = e.detail.value;
    this._selectedValuesOrOptionsChanged(this.selectedValues, this.options);
  }
}
