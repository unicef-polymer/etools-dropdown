import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import {CommonFunctionality} from './mixins/common-mixin.js';
import {MissingOptions} from './mixins/missing-options-mixin.js';
import {timeOut} from '@polymer/polymer/lib/utils/async.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import EtoolsLogsMixin from '@unicef-polymer/etools-behaviors/etools-logs-mixin.js';
import '@unicef-polymer/etools-ajax/etools-ajax.js';
import './scripts/es6-polyfills.js';
import './elements/searchbox-input.js';
import './elements/options-list.js';
import './styles/esmm-shared-styles.js';

/**
 * @polymer
 * @mixinFunction
 * @appliesMixin EsmmMixins.MissingOptions
 * @appliesMixin EsmmMixins.CommonFunctionality
 * @appliesMixin EtoolsLogsMixin
 */
const DropdownRequiredMixins = MissingOptions(CommonFunctionality(EtoolsLogsMixin(PolymerElement)));

/**
 * `etools-dropdown`
 *
 * @customElement
 * @polymer
 * @appliesMixin DropdownRequiredMixins
 * @demo demo/index.html
 */
export class EtoolsDropdown extends DropdownRequiredMixins {
  static get template() {
    // language=HTML
    return html`
      <style include="paper-material-styles esmm-shared-styles">
        :host {
          --paper-input-container: {
            cursor: var(--esmm-select-cursor);
          }
          --paper-input-suffix: {
            bottom: auto;
            right: auto;
            position: static;
          }
        }
        #main {
          width: 133%;
        }
        #main iron-icon {
          @apply --esmm-icons;
        }
        iron-input > input {
          @apply --paper-input-container-shared-input-style;
        }
        #label-container {
          overflow: visible;
          max-width: 133%;
        }
        .label-slot-container {
          position: relative;
          display: inline;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .label-slot-container > * {
          float: left;
        }
      </style>
      <etools-ajax
        id="missingOptionsAjax"
        params="[[ajaxParams]]"
        on-success="handleMissingOptionsReqResponse"
        on-fail="handleMissingOptionsReqError"
      ></etools-ajax>
      <paper-input-container
        id="main"
        no-label-float="[[noLabelFloat]]"
        always-float-label
        auto-validate$="[[_getAutoValidate()]]"
        disabled$="[[disabled]]"
        invalid="[[invalid]]"
        on-keydown="_onKeyDown"
        on-tap="_openMenu"
      >
        <slot name="prefix" slot="prefix"></slot>

        <div id="label-container" part="esmm-label-container" class="paper-input-label" slot="label">
          <label hidden$="[[!label]]" aria-hidden="true" part="esmm-label" class="paper-input-label" for$="[[_inputId]]"
            >[[label]]</label
          >
          <div class="label-slot-container" part="esmm-label-suffix">
            <slot name="label-suffix"></slot>
          </div>
        </div>

        <!-- Need to bind maxlength so that the paper-input-char-counter works correctly -->
        <iron-input
          bind-value="[[getLabel(selectedItem)]]"
          slot="input"
          class="paper-input-input"
          id$="[[_inputId]]"
          maxlength$="[[maxlength]]"
          allowed-pattern="[[allowedPattern]]"
          invalid="[[invalid]]"
          on-invalid-changed="_invalidInputChanged"
          validator="[[validator]]"
        >
          <input
            readonly
            aria-labelledby$="[[_ariaLabelledBy]]"
            aria-describedby$="[[_ariaDescribedBy]]"
            disabled$="[[disabled]]"
            title$="[[title]]"
            type$="[[type]]"
            pattern$="[[pattern]]"
            required$="[[required]]"
            autocomplete$="[[autocomplete]]"
            autofocus$="[[autofocus]]"
            inputmode$="[[inputmode]]"
            minlength$="[[minlength]]"
            maxlength$="[[maxlength]]"
            min$="[[min]]"
            max$="[[max]]"
            step$="[[step]]"
            name$="[[name]]"
            placeholder$="[[placeholder]]"
            list$="[[list]]"
            size$="[[size]]"
            autocapitalize$="[[autocapitalize]]"
            autocorrect$="[[autocorrect]]"
            on-change="_onChange"
            tabindex$="[[tabIndex]]"
            autosave$="[[autosave]]"
            results$="[[results]]"
            accept$="[[accept]]"
            multiple$="[[multiple]]"
            role$="[[inputRole]]"
            aria-haspopup$="[[inputAriaHaspopup]]"
          />
        </iron-input>

        <iron-icon icon="arrow-drop-down" slot="suffix" hidden$="[[readonly]]"></iron-icon>

        <template is="dom-if" if="[[errorMessage]]">
          <paper-input-error aria-live="assertive" slot="add-on">[[errorMessage]]</paper-input-error>
        </template>
      </paper-input-container>
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
        <div
          id="ironDrContent"
          class="paper-material rounded"
          elevation="1"
          slot="dropdown-content"
          part="esmm-dropdown-content"
        >
          <esmm-searchbox-input id="searchbox" search="[[search]]"  on-search-changed="_searchChanged" language="[[language]]" hidden$="{{hideSearch}}"></esmm-searchbox-input>
          <esmm-options-list
            id="optionsList"
            shown-options="[[shownOptions]]"
            selected="[[selected]]"
            on-selected-changed="_selectedValueChanged"
            two-lines-label="[[twoLinesLabel]]"
            option-value="[[optionValue]]"
            option-label="[[optionLabel]]"
            show-no-search-results-warning="[[showNoSearchResultsWarning]]"
            show-limit-warning="[[showLimitWarning]]"
            request-in-progress="[[requestInProgress]]"
            shown-options-limit="[[shownOptionsLimit]]"
            shown-options-count="[[shownOptionsLimit]]"
            no-options-available="[[noOptionsAvailable]]"
            none-option-label="[[noneOptionLabel]]"
            capitalize="[[capitalize]]"
            on-close-etools-dropdown="_closeMenu"
            on-show-more="onShowMore"
          ></esmm-options-list>
        </div>
      </iron-dropdown>
    `;
  }

  static get is() {
    return 'etools-dropdown';
  }

  static get properties() {
    return {
      /** Dropdown selected value `optionValue` prop of the selected option */
      selected: {
        type: Number,
        notify: true,
        observer: '_selectedChanged'
      },
      /** Selected option object */
      selectedItem: {
        type: Object,
        value: null,
        notify: true
      },
      /** Selected value not found in options */
      notFoundOption: {
        type: String
      },
      /** Element title attribute */
      title: {
        type: String,
        reflectToAttribute: true,
        computed: 'getLabel(selectedItem)'
      },
      /* withBackdrop property was added in order to trap the focus within the light DOM of the iron-dropdown.
         Setting this to true solves a bug in PRP where when you have the etools-dropdown in a paper-dialog,
         and you click on the opened drodpdown's scroll,  the dropdown closes.
      **/
      withBackdrop: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      language: {
        type: String,
        value: 'en'
      }
    };
  }

  static get observers() {
    return ['_selectedAndOptionsChanged(selected, options)', '_notFoundOptionAndUrlChanged(notFoundOption, url)'];
  }

  _selectedAndOptionsChanged(selected, options) {
    this._setSelectedItem();

    if (!this.triggerValueChangeEvent) {
      return;
    }

    this._debouncer = Debouncer.debounce(this._debouncer, timeOut.after(20), () => {
      this._fireChangeEvent();
    });
  }

  _setSelectedItem(selected, selectedItem) {
    this.set('notFoundOption', null);
    if (selectedItem) {
      this.set('selectedItem', selectedItem);
      return;
    }
    const dataIsLoadedDynamic = typeof this.loadDataMethod === 'function';
    selected = selected || this.selected;

    if (!selected && String(selected) !== '0') {
      this.set('selectedItem', null);
      return;
    }

    if (selected && String(selected) !== '0' && this._noOptions() && !dataIsLoadedDynamic) {
      this.set('notFoundOption', this.selected);
      this.set('selectedItem', null);
      return;
    }

    selectedItem = this._getItemFromOptions(selected);
    if (!selectedItem) {
      // when using dynamic data load, in case we load options data, must preserve selected item
      if (this.selectedItem && dataIsLoadedDynamic) {
        this.options = [...[this.selectedItem], ...this.options];
        return;
      }
      this.set('notFoundOption', this.selected);
      this.set('selectedItem', null);
    } else {
      this.set('selectedItem', selectedItem);
    }
  }

  _getAutoValidate() {
    return this.autoValidate && this.focusedAtLeastOnce;
  }

  _getItemFromOptions(value) {
    if (this._noOptions()) {
      return null;
    }
    value = String(value);
    return this.options.find((item) => String(item[this.optionValue]) == value);
  }

  _notFoundOptionAndUrlChanged(notFoundOption, url) {
    if (url && notFoundOption) {
      this._handleSelectedNotFoundInOptions(this.notFoundOption);
    }
  }

  _handleSelectedNotFoundInOptions(selected) {
    this.requestMissingOptions([selected]);
    // show warning
    let warnMsg = 'Selected value ';
    warnMsg += selected + " not found in dropdown's options!";
    this.logWarn(warnMsg, 'etools-esmm ' + this.label, null, true);
  }

  _onDropdownClose() {
    super._onDropdownClose();
    if (this.autoValidate) {
      this.validate(this.selected);
    }
  }

  /**
   * Validate dropdown selection
   * @param selected
   * @returns {boolean}
   */
  validate(selected) {
    if (!this.hasAttribute('required') || this.readonly) {
      this.set('invalid', false);
      return true;
    }
    selected = selected || this.selected;
    let valid = true;
    if (!selected) {
      if (parseInt(selected) !== 0) {
        valid = false;
      }
    }
    this.set('invalid', !valid);
    return valid;
  }

  _selectedChanged(selected) {
    // elemAttached condition is to prevent eager validation
    if (this.autoValidate && this.elemAttached) {
      this.validate(selected);
    }
  }

  _onKeyDown(event) {
    if ((event.key === ' ' || event.key === 'Enter') && !event.ctrlKey) {
      event.preventDefault();
      this.onInputFocus(event);
    }
  }

  _fireChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('etools-selected-item-changed', {
        detail: {selectedItem: this.selectedItem},
        bubbles: true,
        composed: true
      })
    );
  }

  _invalidInputChanged(e) {
    this.invalid = e.detail.value;
  }

  _searchChanged(e) {
    this.search = e.detail.value;
  }

  _selectedValueChanged(e) {
    this.selected = e.detail.value;
    this._selectedAndOptionsChanged(this.selected, this.options);
  }
}
