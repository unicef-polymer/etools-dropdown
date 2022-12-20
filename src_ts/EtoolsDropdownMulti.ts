import {LitElement, html, property} from 'lit-element';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import {CommonFunctionalityMixin} from './mixins/common-mixin.js';
import {MissingOptionsMixin} from './mixins/missing-options-mixin.js';
import {timeOut} from '@polymer/polymer/lib/utils/async.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import './scripts/es6-polyfills.js';
import './elements/searchbox-input.js';
import './elements/options-list.js';
import {esmmSharedStyles, tomSelectStyles} from './styles/esmm-shared-styles.js';

/**
 * `etools-dropdown`
 *
 * @customElement
 * @polymer
 * @appliesMixin DropdownRequiredMixins
 * @demo demo/index.html
 */
export class EtoolsDropdownMulti extends CommonFunctionalityMixin(MissingOptionsMixin(LitElement)) {
  /** Dropdown selected value `optionValue` prop of the selected option */
  @property({type: Number}) // observer: '_selectedChanged', notify: true
  selected: any;

  /** Selected option object */
  @property({type: Object}) // notify: true
  selectedItem: any = null;

  /** Selected value not found in options */
  @property({type: Number})
  notFoundOption: number | null = null;

  /** Element title attribute */
  @property({type: String, attribute: 'title', reflect: true}) // computed: 'getLabel(selectedItem)'
  title = '';

  /* withBackdrop property was added in order to trap the focus within the light DOM of the iron-dropdown.
           Setting this to true solves a bug in PRP where when you have the etools-dropdown in a paper-dialog,
           and you click on the opened drodpdown's scroll,  the dropdown closes.
        **/
  @property({type: Boolean, attribute: 'with-backdrop', reflect: true})
  withBackdrop = false;

  @property({type: String})
  language!: string;

  private _debouncer: Debouncer | null = null;

  @property({type: String})
  _inputId: any;
  @property({type: String})
  maxlength: any;
  @property({type: String})
  allowedPattern: any;
  @property({type: String})
  _ariaLabelledBy: any;
  @property({type: String})
  _ariaDescribedBy: any;
  @property({type: String})
  type: any;
  @property({type: String})
  pattern: any;
  @property({type: String})
  autocomplete: any;
  @property({type: String})
  inputmode: any;
  @property({type: String})
  minlength: any;
  @property({type: String})
  min: any;
  @property({type: String})
  max: any;
  @property({type: String})
  step: any;
  @property({type: String})
  name: any;
  @property({type: String})
  list: any;
  @property({type: String})
  size: any;
  @property({type: String})
  autocorrect: any;

  @property({type: String})
  autosave: any;
  @property({type: String})
  results: any;
  @property({type: String})
  accept: any;
  @property({type: String})
  inputRole: any;
  @property({type: String})
  inputAriaHaspopup: any;

  render() {
    // language=HTML
    return html`
      ${esmmSharedStyles} ${tomSelectStyles}
      <style>
        :host {
          --paper-input-container: {
            cursor: var(--esmm-select-cursor);
          }
          --paper-input-suffix: {
            bottom: auto;
            right: auto;
            position: static;
          }
          display: block;
          box-sizing: border-box;
        }
        #main iron-icon {
          @apply --esmm-icons;
        }
        input {
          @apply --paper-input-container-shared-input-style;
        }
        input::placeholder {
          @apply --paper-input-container-shared-input-style;
        }
        #label-container {
          overflow: visible;
          max-width: 133%;
          display: flex;
          flex-wrap: wrap;
        }
        .label-slot-container {
          position: relative;
          display: inline;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex-shrink: 0;
        }
        #label-container label {
          position: relative;
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .label-slot-container > * {
          float: left;
        }
      </style>

      <paper-input-container
      id="main"
      ?no-label-float="${this.noLabelFloat}"
      ?always-float-label="${this.alwaysFloatLabel}"
      ?auto-alidate="${this._getAutoValidate()}"
      ?invalid="${this.invalid}"
    >
      <div id="label-container" part="esmm-label-container" class="paper-input-label" slot="label">
        <label
          ?hidden="${!this.label}"
          title="${this.label}"
          aria-hidden="true"
          part="esmm-label"
          class="paper-input-label"
          for="selected-items-wrapper"
          >${this.label}
        </label>
        <div class="label-slot-container" part="esmm-label-suffix">
          <slot name="input-label-suffix"></slot>
        </div>
      </div>
      <div slot="input" class="paper-input-input">
      <select
        select-node
        multiple
        autocomplete="off" 
        ?disabled="${this.disabled}"
        title="${this.title}"
        ?required="${this.required}"
        ?autofocus="${this.autofocus}"
        name="${this.name}"
        placeholder="${this.placeholder}"
        list="${this.list}"
        size="${this.size}"
        ?autocapitalize="${this.autocapitalize}"
        ?autocorrect="${this.autocorrect}"
        tabindex="${this.tabIndex}"
        @change="${(e: any) => {
         this.selected = e.currentTarget.value;
        }}"
      >
        <option value="">${this.placeholder}</option>
      </select>
      </div>
        </div>
      </paper-input-container>
    `;
  }

  constructor(){
    super();
  }

  updated(changedProperties: any) {
    super.updated(changedProperties);
    if (changedProperties.has('selected') || changedProperties.has('options')) {
      this._selectedAndOptionsChanged(this.selected, this.options);
    }
    if (changedProperties.has('notFoundOption') || changedProperties.has('url')) {
      this._notFoundOptionAndUrlChanged(this.notFoundOption, this.url);
    }
    if (changedProperties.has('selected')) {
      this._selectedChanged(this.selected);
    }
  }

  _selectedAndOptionsChanged(_selected: any, _options: any) {
    this._setSelectedItem();

    if (!this.triggerValueChangeEvent) {
      return;
    }

    this._debouncer = Debouncer.debounce(this._debouncer, timeOut.after(20), () => {
      this._fireChangeEvent();
    });
  }

  _setSelectedItem(selected?: any, selectedItem?: any) {
    this.notFoundOption = null;
    if (selectedItem) {
      this.selectedItem = selectedItem;
      return;
    }
    const dataIsLoadedDynamic = typeof this.loadDataMethod === 'function';
    selected = selected || this.selected;

    if (!selected && String(selected) !== '0') {
      this.selectedItem = null;
      return;
    }

    if (selected && String(selected) !== '0' && this._noOptions() && !dataIsLoadedDynamic) {
      this.notFoundOption = this.selected;
      this.selectedItem = null;
      return;
    }

    selectedItem = this._getItemFromOptions(selected);
    if (!selectedItem) {
      // when using dynamic data load, in case we load options data, must preserve selected item
      if (this.selectedItem && dataIsLoadedDynamic) {
        this.options = [...[this.selectedItem], ...this.options];
        return;
      }
      this.notFoundOption = this.selected;
      this.selectedItem = null;
    } else {
      this.selectedItem = selectedItem;
    }
  }

  _getAutoValidate() {
    return this.autoValidate && this.focusedAtLeastOnce;
  }

  _getItemFromOptions(value: any) {
    if (this._noOptions()) {
      return null;
    }
    value = String(value);
    return this.options.find((item: any) => String(item[this.optionValue]) == value);
  }

  _notFoundOptionAndUrlChanged(notFoundOption: number | null, url: string) {
    if (url && notFoundOption) {
      this._handleSelectedNotFoundInOptions(this.notFoundOption);
    }
  }

  _handleSelectedNotFoundInOptions(selected: any) {
    this.requestMissingOptions([selected]);
    // show warning
    let warnMsg = 'Selected value ';
    warnMsg += selected + " not found in dropdown's options!";
    console.log(warnMsg + ', etools-esmm ' + this.label);
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
  validate(selected?: any) {
    if (!this.hasAttribute('required') || this.readonly) {
      this.invalid = false;
      return true;
    }
    selected = selected || this.selected;
    let valid = true;
    if (!selected) {
      if (parseInt(selected) !== 0) {
        valid = false;
      }
    }
    this.invalid = !valid;
    return valid;
  }

  _selectedChanged(selected?: any) {
    this.title = this.getLabel(this.selectedItem);
    // elemAttached condition is to prevent eager validation
    if (this.autoValidate && this.elemAttached) {
      this.validate(selected);
    }
  }

  _onKeyDown(event: KeyboardEvent) {
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

  _invalidInputChanged(e: CustomEvent) {
    this.invalid = e.detail.value;
  }

  _searchChanged(e: CustomEvent) {
    this.search = e.detail.value;
  }

  _selectedValueChanged(e: CustomEvent) {
    this.selected = e.detail.value;
    this._selectedAndOptionsChanged(this.selected, this.options);
  }
}
