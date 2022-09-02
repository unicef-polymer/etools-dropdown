var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, property, customElement } from 'lit-element';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { CommonFunctionality } from './mixins/common-mixin.js';
import { MissingOptions } from './mixins/missing-options-mixin.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import './scripts/es6-polyfills.js';
import './elements/searchbox-input.js';
import './elements/options-list.js';
import { esmmSharedStyles } from './styles/esmm-shared-styles.js';
/**
 * `etools-dropdown`
 *
 * @customElement
 * @polymer
 * @appliesMixin DropdownRequiredMixins
 * @demo demo/index.html
 */
let EtoolsDropdown = class EtoolsDropdown extends CommonFunctionality(MissingOptions(LitElement)) {
    constructor() {
        super(...arguments);
        /** Selected option object */
        this.selectedItem = null;
        /** Selected value not found in options */
        this.notFoundOption = null;
        /** Element title attribute */
        this.title = '';
        /* withBackdrop property was added in order to trap the focus within the light DOM of the iron-dropdown.
                 Setting this to true solves a bug in PRP where when you have the etools-dropdown in a paper-dialog,
                 and you click on the opened drodpdown's scroll,  the dropdown closes.
              **/
        this.withBackdrop = false;
        this.language = 'en';
        this._debouncer = null;
    }
    render() {
        // language=HTML
        return html `
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
    updated(changedProperties) {
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
    _selectedAndOptionsChanged(_selected, _options) {
        this._setSelectedItem();
        if (!this.triggerValueChangeEvent) {
            return;
        }
        this._debouncer = Debouncer.debounce(this._debouncer, timeOut.after(20), () => {
            this._fireChangeEvent();
        });
    }
    _setSelectedItem(selected, selectedItem) {
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
        }
        else {
            this.selectedItem = selectedItem;
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
    validate(selected) {
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
    _selectedChanged(selected) {
        this.title = this.getLabel(this.selectedItem);
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
        this.dispatchEvent(new CustomEvent('etools-selected-item-changed', {
            detail: { selectedItem: this.selectedItem },
            bubbles: true,
            composed: true
        }));
    }
    _invalidInputChanged(e) {
        this.invalid = e.detail.value;
    }
    _searchChanged(e) {
        this.search = e.detail.value;
    }
    _selectedValueChanged(e) {
        this.selected = e.detail.value;
        console.log(this.selected);
        this._selectedAndOptionsChanged(this.selected, this.options);
    }
};
__decorate([
    property({ type: Number }) // observer: '_selectedChanged', notify: true
], EtoolsDropdown.prototype, "selected", void 0);
__decorate([
    property({ type: Object }) // notify: true
], EtoolsDropdown.prototype, "selectedItem", void 0);
__decorate([
    property({ type: Number })
], EtoolsDropdown.prototype, "notFoundOption", void 0);
__decorate([
    property({ type: String, attribute: 'title', reflect: true }) // computed: 'getLabel(selectedItem)'
], EtoolsDropdown.prototype, "title", void 0);
__decorate([
    property({ type: Boolean, attribute: 'with-backdrop', reflect: true })
], EtoolsDropdown.prototype, "withBackdrop", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "language", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "_inputId", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "maxlength", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "allowedPattern", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "validator", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "_ariaLabelledBy", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "_ariaDescribedBy", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "type", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "pattern", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "autocomplete", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "inputmode", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "minlength", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "min", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "max", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "step", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "name", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "list", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "size", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "autocorrect", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "_onChange", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "autosave", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "results", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "accept", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "multiple", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "inputRole", void 0);
__decorate([
    property({ type: String })
], EtoolsDropdown.prototype, "inputAriaHaspopup", void 0);
EtoolsDropdown = __decorate([
    customElement('etools-dropdown')
], EtoolsDropdown);
export { EtoolsDropdown };
