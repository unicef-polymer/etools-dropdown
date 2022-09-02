var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, property, customElement } from 'lit-element';
import '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-input/paper-input-error.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { ListItemUtils } from '../mixins/list-item-utils-mixin.js';
/**
 * @litelement
 * @customElement
 * @appliesMixin EsmmMixins.ListItemUtils
 */
let EsmmSelectedOptions = class EsmmSelectedOptions extends ListItemUtils(LitElement) {
    constructor() {
        super(...arguments);
        this.selectedItems = [];
        this.label = '';
        this.noLabelFloat = false;
        this.alwaysFloatLabel = false;
        this.placeholder = '';
        this.autoValidate = false;
        this.readonly = false;
        this.disabled = false;
        this.invalid = false;
        this.errorMessage = '';
        this._hidePlaceholder = false;
    }
    render() {
        // language=HTML
        return html `
      <style>
        *[hidden] {
          display: none !important;
        }

        :host {
          width: 100%;
        }

        #container {
          outline: none;
        }

        iron-icon {
          @apply --esmm-icons;
        }

        .selected-item {
          width: auto;
          height: auto;
          margin-right: 8px;
          line-height: 24px;
        }

        :host([readonly]) .selected-item {
          margin-right: 0;
        }

        :host([readonly]) .selected-item paper-icon-button,
        :host([readonly]) .selected-item:last-of-type .readonly-separator {
          display: none;
        }

        #selected-items-wrapper {
          width: 100%;
          display: inline;
        }

        .readonly-separator {
          display: inline-block;
          padding: 0 5px 0 8px;
          margin: 0;
        }

        .selected-item paper-icon-button {
          color: var(--error-color);
          padding: 0;
          height: 18px;
          width: 18px;
          margin-top: -2px;
        }

        .placeholder {
          color: var(--esmm-multi-placeholder-color, rgba(0, 0, 0, 0.54));
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
        id="container"
        tabindex="1"
        ?no-label-float="${this.noLabelFloat}"
        @tap="${this.openMenu}"
        @focus="${this.onInputFocus}"
        ?always-float-label="${this._computeAlwaysFloatLabel(this.alwaysFloatLabel, this.placeholder)}"
        ?auto-validate="${this.autoValidate}"
        ?disabled="${this.disabled}"
        ?invalid="${this.invalid}"
      >
        <div id="label-container" part="esmm-label-container" class="paper-input-label" slot="label">
          <label
            ?hidden="${!this.label}"
            aria-hidden="true"
            part="esmm-label"
            class="paper-input-label"
            for="selected-items-wrapper"
            >${this.label}
          </label>
          <div class="label-slot-container" part="esmm-label-suffix" @tap="${this._stopEvent}">
            <slot name="input-label-suffix"></slot>
          </div>
        </div>

        <div slot="input" class="paper-input-input">
          <span class="placeholder" ?hidden="${this._hidePlaceholder}"> ${this.placeholder} </span>
          <div id="selected-items-wrapper" ?hidden="${!this._hidePlaceholder}">
            ${this.selectedItems && this.selectedItems.length &&
            this.selectedItems.map((item) => html `
                <span class="selected-item">
                  <span>${this.getLabel(item)}</span>
                  <span class="readonly-separator" ?hidden="${!this.readonly}">|</span>
                  <paper-icon-button
                    id="iconRemoveSelected"
                    ?disabled="${this.disabled}"
                    ?hidden="${this.readonly}"
                    icon="close"
                    @tap="${(e) => this._removeItem(e, item)}"
                    @focus="${this._onXFocus}"
                  ></paper-icon-button>
                </span>
              `)}
          </div>
        </div>

        <iron-icon icon="arrow-drop-down" slot="suffix" ?hidden="${this.readonly}"></iron-icon>
        <paper-input-error aria-live="assertive" slot="add-on" ?hidden="${!this.errorMessage}"
          >${this.errorMessage}</paper-input-error
        >
      </paper-input-container>
    `;
    }
    updated(changedProperties) {
        if (changedProperties.has('selectedItems')) {
            this._selectedItemsDisplayHasChanged();
        }
    }
    /**
     * @param alwaysFloatLabel
     * @param placeholder
     * @returns {*}
     * @private
     */
    _computeAlwaysFloatLabel(alwaysFloatLabel, placeholder) {
        return alwaysFloatLabel || placeholder;
    }
    /**
     * Show or hide placeholder
     * @param e
     * @private
     */
    _selectedItemsDisplayHasChanged() {
        // hide/show placeholder
        if (this.selectedItems instanceof Array && this.selectedItems.length > 0) {
            this._hidePlaceholder = true;
        }
        else {
            this._hidePlaceholder = false;
        }
        // Notifies paper-dialog to center its self
        this.dispatchEvent(new CustomEvent('iron-resize', {
            bubbles: true,
            composed: true
        }));
    }
    /**
     * @event remove-selected-item
     * @param e
     * @private
     */
    _removeItem(e, item) {
        // fire remove event to parent
        this._stopEvent(e);
        this.dispatchEvent(new CustomEvent('remove-selected-item', {
            detail: item[this.optionValue],
            bubbles: true,
            composed: true
        }));
    }
    /**
     * @param e
     * @private
     */
    _onXFocus(e) {
        this._stopEvent(e);
    }
    _stopEvent(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
};
__decorate([
    property({ type: Array })
], EsmmSelectedOptions.prototype, "selectedItems", void 0);
__decorate([
    property({ type: String, attribute: 'label' })
], EsmmSelectedOptions.prototype, "label", void 0);
__decorate([
    property({ type: Boolean, attribute: 'no-label-float' })
], EsmmSelectedOptions.prototype, "noLabelFloat", void 0);
__decorate([
    property({ type: Boolean, attribute: 'always-float-label' })
], EsmmSelectedOptions.prototype, "alwaysFloatLabel", void 0);
__decorate([
    property({ type: String, attribute: 'placeholder' })
], EsmmSelectedOptions.prototype, "placeholder", void 0);
__decorate([
    property({ type: Boolean, attribute: 'auto-validate' })
], EsmmSelectedOptions.prototype, "autoValidate", void 0);
__decorate([
    property({ type: Boolean, attribute: 'readonly', reflect: true })
], EsmmSelectedOptions.prototype, "readonly", void 0);
__decorate([
    property({ type: Boolean, attribute: 'disabled', reflect: true })
], EsmmSelectedOptions.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean, attribute: 'invalid', reflect: true })
], EsmmSelectedOptions.prototype, "invalid", void 0);
__decorate([
    property({ type: String, attribute: 'error-message' })
], EsmmSelectedOptions.prototype, "errorMessage", void 0);
__decorate([
    property({ type: Boolean })
], EsmmSelectedOptions.prototype, "_hidePlaceholder", void 0);
__decorate([
    property({ type: Object })
], EsmmSelectedOptions.prototype, "openMenu", void 0);
__decorate([
    property({ type: Object })
], EsmmSelectedOptions.prototype, "onInputFocus", void 0);
EsmmSelectedOptions = __decorate([
    customElement('esmm-selected-options')
], EsmmSelectedOptions);
export { EsmmSelectedOptions };
