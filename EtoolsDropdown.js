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
const DropdownRequiredMixins = MissingOptions(CommonFunctionality(
    EtoolsLogsMixin(PolymerElement)));

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
        }
        #main {
          width: 100%;
        }
        #main iron-icon {
          @apply --esmm-icons;
        }
        .label-container > * {
          @apply --paper-font-common-nowrap;
          @apply --paper-font-subhead;
        }
        .label-container :first-child {
          @apply --paper-input-container-label;
        }
        .label-container :not(:first-child)::slotted(*) {
          display: inline;
          flex-direction: row;
        }
        .label-container {
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: ellipsis !important;
          width: 133% !important;
          max-width: 133% !important;

          position: absolute;
          top: 0;
          left: 0;
          font: inherit;
          color: var(--paper-input-container-color, var(--secondary-text-color));
          -webkit-transition: -webkit-transform 0.25s, width 0.25s;
          transition: transform 0.25s, width 0.25s;
          -webkit-transform-origin: left top;
          transform-origin: left top;
          /* Fix for safari not focusing 0-height date/time inputs with -webkit-apperance: none; */
          min-height: 1px;
          -webkit-transform: translateY(-75%) scale(0.75);
          transform: translateY(-75%) scale(0.75);
        }

        iron-input > input {
          @apply --paper-input-container-shared-input-style;
          font-family: inherit;
          font-weight: inherit;
          font-size: inherit;
          letter-spacing: inherit;
          word-spacing: inherit;
          line-height: inherit;
          text-shadow: inherit;
          color: inherit;
          cursor: inherit;
        }
      </style>
      <etools-ajax id="missingOptionsAjax" params="[[ajaxParams]]" on-success="handleMissingOptionsReqResponse"
                   on-fail="handleMissingOptionsReqError"></etools-ajax>

      <paper-input-container id="main" no-label-float="[[noLabelFloat]]"
          always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel,placeholder)]]"
          auto-validate$="[[autoValidate]]" disabled$="[[disabled]]" invalid="[[invalid]]"
          on-focus="onInputFocus" on-tap="_openMenu">

        <slot name="prefix" slot="prefix"></slot>

        <div class="label-container" slot="label">
          <label hidden$="[[!label]]" aria-hidden="true" for$="[[_inputId]]">[[label]]</label>
          <slot name="label-suffix"></slot>
        </div>

        <!-- Need to bind maxlength so that the paper-input-char-counter works correctly -->
        <iron-input bind-value="[[getLabel(selectedItem)]]" slot="input" class="input-element" id$="[[_inputId]]" maxlength$="[[maxlength]]"
              allowed-pattern="[[allowedPattern]]" invalid="{{invalid}}" validator="[[validator]]">
          <input aria-labelledby$="[[_ariaLabelledBy]]" aria-describedby$="[[_ariaDescribedBy]]" disabled$="[[disabled]]"
              title$="[[title]]" type$="[[type]]" pattern$="[[pattern]]" required$="[[required]]" autocomplete$="[[autocomplete]]"
              autofocus$="[[autofocus]]" inputmode$="[[inputmode]]" minlength$="[[minlength]]" maxlength$="[[maxlength]]"
              min$="[[min]]" max$="[[max]]" step$="[[step]]" name$="[[name]]" placeholder$="[[placeholder]]"
              readonly$="[[readonly]]" list$="[[list]]" size$="[[size]]" autocapitalize$="[[autocapitalize]]"
              autocorrect$="[[autocorrect]]" on-change="_onChange" tabindex$="[[tabIndex]]" autosave$="[[autosave]]" results$="[[results]]"
              accept$="[[accept]]" multiple$="[[multiple]]" role$="[[inputRole]]" aria-haspopup$="[[inputAriaHaspopup]]">
        </iron-input>

        <iron-icon icon="arrow-drop-down" slot="suffix" hidden\$="[[readonly]]"></iron-icon>

        <template is="dom-if" if="[[errorMessage]]">
          <paper-input-error aria-live="assertive" slot="add-on">[[errorMessage]]</paper-input-error>
        </template>

    </paper-input-container>


      <iron-dropdown id="dropdownMenu" horizontal-align="[[horizontalAlign]]" vertical-offset="[[verticalOffset]]"
                     dynamic-align="[[!noDynamicAlign]]" on-iron-overlay-opened="_onDropdownOpen"
                     on-iron-overlay-closed="_onDropdownClose" disabled="[[_menuBtnIsDisabled(disabled, readonly)]]"
                     no-cancel-on-outside-click allow-click-through
                     with-backdrop="[[withBackdrop]]">
        <div id="ironDrContent" class="paper-material" elevation="1" slot="dropdown-content">
          <esmm-searchbox-input id="searchbox" search="{{search}}" hidden\$="{{hideSearch}}"></esmm-searchbox-input>
          <esmm-options-list id="optionsList" shown-options="[[shownOptions]]" selected="{{selected}}"
                             two-lines-label="[[twoLinesLabel]]" option-value="[[optionValue]]"
                             option-label="[[optionLabel]]"
                             show-no-search-results-warning="[[showNoSearchResultsWarning]]"
                             show-limit-warning="[[showLimitWarning]]" shown-options-limit="[[shownOptionsLimit]]"
                             no-options-available="[[noOptionsAvailable]]" none-option-label="[[noneOptionLabel]]"
                             capitalize="[[capitalize]]" on-close-etools-dropdown="_closeMenu"></esmm-options-list>
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
      }
    };
  }

  static get observers() {
    return [
      '_selectedAndOptionsChanged(selected, options)',
      '_notFoundOptionAndUrlChanged(notFoundOption, url)'
    ];
  }

  _selectedAndOptionsChanged(selected, options) {
    this._setSelectedItem();
    if (!this.triggerValueChangeEvent) {
      return;
    }

    this._debouncer = Debouncer.debounce(
        this._debouncer,
        timeOut.after(20),
        () => {
          this._fireChangeEvent();
        }
    );
  }

  _setSelectedItem(selected, selectedItem) {
    this.set('notFoundOption', null);
    if (selectedItem) {
      this.set('selectedItem', selectedItem);
      return;
    }

    selected = selected || this.selected;

    if (!selected && this._noOptions()) {
      this.set('selectedItem', null);
      return;
    }

    if (selected && this._noOptions()) {
      this.set('notFoundOption', this.selected);
      this.set('selectedItem', null);
      return;
    }

    selectedItem = this._getItemFromOptions(selected);
    if (!selectedItem) {
      this.set('notFoundOption', this.selected);
      this.set('selectedItem', null);
    } else {
      this.set('selectedItem', selectedItem);
    }
  }

  _getItemFromOptions(value) {
    if (this._noOptions()) {
      return null;
    }
    return this.options.find(item => item[this.optionValue] == value);
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
    warnMsg += selected + ' not found in dropdown\'s options!';
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

  _fireChangeEvent() {
    this.dispatchEvent(new CustomEvent('etools-selected-item-changed', {
      detail: {selectedItem: this.selectedItem},
      bubbles: true,
      composed: true
    }));
  }
}
