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
import '@unicef-polymer/etools-ajax/etools-ajax.js';
import {esmmSharedStyles} from './styles/esmm-shared-styles.js';

/**
 * `etools-dropdown`
 *
 * @customElement
 * @polymer
 * @appliesMixin DropdownRequiredMixins
 * @demo demo/index.html
 */
export class EtoolsDropdown extends CommonFunctionalityMixin(MissingOptionsMixin(LitElement)) {
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
  validator: any;
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
  _onChange: any;
  @property({type: String})
  autosave: any;
  @property({type: String})
  results: any;
  @property({type: String})
  accept: any;
  @property({type: String})
  multiple: any;
  @property({type: String})
  inputRole: any;
  @property({type: String})
  inputAriaHaspopup: any;

  render() {
    // language=HTML
    return html`
      ${esmmSharedStyles}
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
        .params="${this.ajaxParams}"
        @success="${this.handleMissingOptionsReqResponse}"
        @fail="${this.handleMissingOptionsReqError}"
      ></etools-ajax>
      <paper-input-container
        id="main"
        ?no-label-float="${this.noLabelFloat}"
        ?always-float-label="${this.alwaysFloatLabel}"
        ?auto-alidate="${this._getAutoValidate()}"
        ?disabled="${this.disabled}"
        ?invalid="${this.invalid}"
        @keydown="${this._onKeyDown}"
        @tap="${this._openMenu}"
      >
        <slot name="prefix" slot="prefix"></slot>

        <div id="label-container" part="esmm-label-container" class="paper-input-label" slot="label">
          <label
            ?hidden="${!this.label}"
            aria-hidden="true"
            part="esmm-label"
            class="paper-input-label"
            for="${this._inputId}"
            >${this.label}</label
          >
          <div class="label-slot-container" part="esmm-label-suffix">
            <slot name="label-suffix"></slot>
          </div>
        </div>

        <!-- Need to bind maxlength so that the paper-input-char-counter works correctly -->
        <iron-input
          bind-value="${this.getLabel(this.selectedItem)}"
          slot="input"
          class="paper-input-input"
          id="${this._inputId}"
          max-length="${this.maxlength}"
          .allowedPattern="${this.allowedPattern}"
          .invalid="${this.invalid}"
          @invalid-changed="${this._invalidInputChanged}"
          .validator="${this.validator}"
        >
          <input
            readonly
            aria-labelledby="${this._ariaLabelledBy}"
            aria-describedby="${this._ariaDescribedBy}"
            ?disabled="${this.disabled}"
            title="${this.title}"
            type="${this.type}"
            pattern="${this.pattern}"
            ?required="${this.required}"
            ?autocomplete="${this.autocomplete}"
            ?autofocus="${this.autofocus}"
            inputmode="${this.inputmode}"
            minlength="${this.minlength}"
            maxlength="${this.maxlength}"
            min="${this.min}"
            max="${this.max}"
            step="${this.step}"
            name="${this.name}"
            placeholder="${this.placeholder}"
            list="${this.list}"
            size="${this.size}"
            ?autocapitalize="${this.autocapitalize}"
            ?autocorrect="${this.autocorrect}"
            @input="${this._onChange}"
            tabindex="${this.tabIndex}"
            ?autosave="${this.autosave}"
            results="${this.results}"
            accept="${this.accept}"
            ?multiple="${this.multiple}"
            role="${this.inputRole}"
            aria-haspopup="${this.inputAriaHaspopup}"
          />
        </iron-input>

        <iron-icon icon="arrow-drop-down" slot="suffix" ?hidden="${this.readonly}"></iron-icon>
        <paper-input-error aria-live="assertive" slot="add-on" ?hidden="${!this.errorMessage}"
          >${this.errorMessage}</paper-input-error
        >
      </paper-input-container>
      <iron-dropdown
        id="dropdownMenu"
        part="esmm-dropdownmenu"
        horizontal-align="${this.horizontalAlign}"
        vertical-offset="${this.verticalOffset}"
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
          <esmm-searchbox-input
            id="searchbox"
            .search="${this.search}"
            @search-changed="${this._searchChanged}"
            .language="${this.language}"
            ?hidden="${this.hideSearch}"
          ></esmm-searchbox-input>
          <esmm-options-list
            id="optionsList"
            .shownOptions="${this.shownOptions}"
            .selected="${this.selected}"
            @selected-changed="${this._selectedValueChanged}"
            ?two-lines-label="${this.twoLinesLabel}"
            .optionValue="${this.optionValue}"
            .optionLabel="${this.optionLabel}"
            .showNoSearchResultsWarning="${this.showNoSearchResultsWarning}"
            .showLimitWarning="${this.showLimitWarning}"
            .requestInProgress="${this.requestInProgress}"
            .shownOptionsLimit="${this.shownOptionsLimit}"
            .shownOptionsCount="${this.shownOptionsLimit}"
            .noOptionsAvailable="${this.noOptionsAvailable}"
            .noneOptionLabel="${this.noneOptionLabel}"
            ?capitalize="${this.capitalize}"
            @close-etools-dropdown="${this._closeMenu}"
            @show-more="${this.onShowMore}"
            .language="${this.language}"
          ></esmm-options-list>
        </div>
      </iron-dropdown>
    `;
  }

  updated(changedProperties: any) {
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
