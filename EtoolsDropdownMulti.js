import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import {CommonFunctionality} from './mixins/common-mixin.js';
import {MissingOptions} from './mixins/missing-options-mixin.js';
import {timeOut} from '@polymer/polymer/lib/utils/async.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import EtoolsLogsMixin from '@unicef-polymer/etools-behaviors/etools-logs-mixin.js';
import '@unicef-polymer/etools-ajax/etools-ajax.js';
import './scripts/es6-polyfills.js';
import './elements/selected-options.js';
import './elements/searchbox-input.js';
import './elements/options-list.js';
import './styles/esmm-shared-styles.js';
import {getTranslation} from './utils/translate.js';

/**
 * @polymer
 * @mixinFunction
 * @appliesMixin EsmmMixins.MissingOptions
 * @appliesMixin EsmmMixins.CommonFunctionality
 * @appliesMixin EtoolsLogsMixin
 */
const MultiDropdownRequiredMixins = MissingOptions(CommonFunctionality(EtoolsLogsMixin(PolymerElement)));

/**
 * `etools-dropdown-multi`
 *
 * @polymer
 * @customElement
 * @appliesMixin MultiDropdownRequiredMixins
 * @demo demo/index-multi.html
 */
export class EtoolsDropdownMulti extends MultiDropdownRequiredMixins {
  static get template() {
    // language=HTML
    return html`
      <style include="paper-material-styles esmm-shared-styles">
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
        }
      </style>

      <etools-ajax
        id="missingOptionsAjax"
        params="[[ajaxParams]]"
        on-success="handleMissingOptionsReqResponse"
        on-fail="handleMissingOptionsReqError"
      ></etools-ajax>

      <esmm-selected-options
        id="main"
        selected-items="[[selectedItems]]"
        label="[[label]]"
        placeholder="[[placeholder]]"
        always-float-label="[[alwaysFloatLabel]]"
        no-label-float="[[noLabelFloat]]"
        two-lines-label="[[twoLinesLabel]]"
        capitalize="[[capitalize]]"
        readonly="[[readonly]]"
        disabled="[[disabled]]"
        invalid="[[invalid]]"
        option-value="[[optionValue]]"
        option-label="[[optionLabel]]"
        error-message="[[_getErrorMessage(errorMessage, invalid)]]"
        open-menu="[[_openMenu]]"
        on-input-focus="[[onInputFocus]]"
        exportparts="esmm-label-container, esmm-label, esmm-label-suffix"
      >
        <span slot="input-label-suffix">
          <slot name="label-suffix"></slot>
        </span>
      </esmm-selected-options>

      <iron-dropdown
        id="dropdownMenu"
        part="esmm-dropdownmenu"
        horizontal-align="[[horizontalAlign]]"
        vertical-offset="[[verticalOffset]]"
        dynamic-align="[[!noDynamicAlign]]"
        on-iron-overlay-opened="_onDropdownOpen"
        on-iron-overlay-closed="_onDropdownClose"
        disabled="[[_menuBtnIsDisabled(disabled, readonly)]]"
        no-cancel-on-outside-click
        allow-click-through
        with-backdrop="[[withBackdrop]]"
      >
        <div id="ironDrContent" class="paper-material rounded" elevation="1" slot="dropdown-content">
          <div id="dropdown-controls">
            <esmm-searchbox-input
              id="searchbox"
              search="{{search}}"
              hidden$="{{hideSearch}}"
              language="[[language]]"
            ></esmm-searchbox-input>
          </div>

          <esmm-options-list
            id="optionsList"
            shown-options="[[shownOptions]]"
            multi=""
            selected-values="{{selectedValues}}"
            two-lines-label="[[twoLinesLabel]]"
            option-value="[[optionValue]]"
            option-label="[[optionLabel]]"
            request-in-progress="[[requestInProgress]]"
            show-no-search-results-warning="[[showNoSearchResultsWarning]]"
            show-limit-warning="[[showLimitWarning]]"
            shown-options-limit="[[shownOptionsLimit]]"
            shown-options-count="[[shownOptionsLimit]]"
            no-options-available="[[noOptionsAvailable]]"
            capitalize="[[capitalize]]"
            on-show-more="onShowMore"
            language="[[language]]"
          >
          </esmm-options-list>
          <span
            title="[[_getCloseBtnText(closeText, language)]]"
            class="close-btn"
            part="esmm-close-btn"
            hidden$="{{hideClose}}"
            on-tap="_closeMenu"
          >
            [[_getCloseBtnText(closeText, language)]]
          </span>
        </div>
      </iron-dropdown>
    `;
  }

  constructor() {
    super();
    if (!this.language) {
      this.language = window.localStorage.defaultLanguage || 'en';
    }
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  handleLanguageChange(e) {
    this.language = e.detail.language;
  }

  static get is() {
    return 'etools-dropdown-multi';
  }

  static get properties() {
    return {
      /** Dropdown selected values */
      selectedValues: {
        type: Array,
        value: [],
        notify: true
      },
      /** Selected options objects */
      selectedItems: {
        type: Array,
        value: [],
        notify: true
      },
      prevSelectedItems: {
        type: Array,
        value: []
      },
      /** Array of not found values (in options list) */
      notFoundOptions: {
        type: Array,
        value: []
      },
      /** Element title attribute */
      title: {
        type: String,
        computed: '_getElementTitle(selectedItems)',
        reflectToAttribute: true
      },
      closeText: {
        type: String,
        reflectToAttribute: true
      },
      language: {
        type: String
      }
    };
  }

  static get observers() {
    return [
      '_selectedValuesOrOptionsChanged(selectedValues, options)',
      '_selectedValuesOrOptionsChanged(selectedValues.length, options)',
      '_notFoundOptionsAndUrlChanged(notFoundOptions, url)',
      '_selectedItemsChanged(selectedItems, selectedItems.length)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('language-changed', this.handleLanguageChange);
    this.addEventListener('remove-selected-item', this._removeSelectedItem.bind(this));
    this._openMenu = this._openMenu.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('language-changed', this.handleLanguageChange);
  }

  _selectedValuesOrOptionsChanged(selectedValuesOrLength, options) {
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
        (s) => !this.options.some((o) => String(o[this.optionValue]) === String(s[this.optionValue]))
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
  _setSelectedItems(selectedValues) {
    this.notFoundOptions = null;
    if (typeof selectedValues === 'undefined') {
      selectedValues = this.selectedValues;
    }
    if (this._noSelectedValues(selectedValues) && this._noOptions()) {
      this.set('selectedItems', []);
      return;
    }
    if (!this._noSelectedValues(selectedValues) && this._noOptions()) {
      this._setAnyNotFoundOptions(this.selectedItems, selectedValues);
      return;
    }
    const selectedItems = this.options.filter((item) => {
      return selectedValues instanceof Array && item[this.optionValue]
        ? selectedValues.includes(item[this.optionValue].toString())
        : false;
    });

    this._setAnyNotFoundOptions(selectedItems, selectedValues);
    this.set('selectedItems', selectedItems);
  }

  _selectedItemsChanged(selectedItems) {
    if (JSON.stringify(this.prevSelectedItems) !== JSON.stringify(selectedItems)) {
      this.prevSelectedItems = selectedItems;
      setTimeout(() => {
        this._setDropdownMenuVerticalOffset();
      }, 10);
    }

    if (this._isUndefined(selectedItems)) {
      return;
    }
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

  _setAnyNotFoundOptions(selectedItems, selectedValues) {
    // prevent using non array variables
    selectedItems = selectedItems instanceof Array ? selectedItems : [];
    selectedValues = selectedValues instanceof Array ? selectedValues : [];
    if (this._noSelectedItems(selectedItems)) {
      this.notFoundOptions = selectedValues;
    } else if (selectedItems.length < selectedValues.length) {
      const selectedItemsValues = this._getValuesFromItems(selectedItems);
      this.notFoundOptions = selectedValues.filter((value) => {
        return !selectedItemsValues.includes(value);
      });
    }
  }

  _removeSelectedItem(e) {
    // Compute selectedItems without the removed item
    const selectedItems = this.selectedItems.filter((item) => {
      return item[this.optionValue] !== e.detail;
    });

    if (this._noSelectedItems(selectedItems)) {
      this.selectedValues = [];
      this.set('selectedItems', []);
    } else {
      this.selectedValues = this._getValuesFromItems(selectedItems);
      this.set('selectedItems', selectedItems);
    }

    if (this.autoValidate) {
      this.validate(this.selectedValues);
    }
  }

  /**
   * This observer makes sure request for missing option is triggered only after the url is set also.
   * notFoundOption is actually this.selected
   */
  _notFoundOptionsAndUrlChanged(notFoundOptions, url) {
    if (url && this.arrayIsNotEmpty(notFoundOptions)) {
      this._handleSelectedNotFoundInOptions(this.notFoundOptions);
    }
  }

  _handleSelectedNotFoundInOptions(notFoundSelectedValues) {
    this.requestMissingOptions(notFoundSelectedValues);
    // show warning
    let warnMsg = 'Selected value ';
    const notFoundValues =
      notFoundSelectedValues instanceof Array ? notFoundSelectedValues.join(', ') : notFoundSelectedValues;
    warnMsg += notFoundValues + " not found in dropdown's options!";
    this.logWarn(warnMsg, 'etools-esmm ' + this.label, null, true);
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
  validate(selectedValues) {
    if (!this.hasAttribute('required') || this.readonly) {
      this.set('invalid', false);
      return true;
    }

    if (typeof selectedValues === 'undefined') {
      selectedValues = this.selectedValues;
    }
    const invalid = !selectedValues || !selectedValues.length;
    this.set('invalid', invalid);
    return !invalid;
  }

  _getValuesFromItems(selectedItems) {
    return selectedItems && selectedItems.length > 0
      ? selectedItems.map((item) => {
          return item[this.optionValue].toString();
        })
      : null;
  }

  _noSelectedValues(selectedValues) {
    if (typeof selectedValues === 'undefined') {
      selectedValues = this.selectedValues;
    }
    return !selectedValues || !selectedValues.length;
  }

  _noSelectedItems(selectedItems) {
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

  _getElementTitle(selectedItems) {
    const labels = selectedItems.map((item) => {
      return this.getLabel(item);
    });

    return labels.join(' | ');
  }

  _getCloseBtnText(closeText, language) {
    if (closeText) {
      return closeText;
    }
    return getTranslation(language, 'CLOSE');
  }
}
