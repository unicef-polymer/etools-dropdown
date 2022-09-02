import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-input/paper-input-error.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import {ListItemUtils} from '../mixins/list-item-utils-mixin.js';

/**
 * @litelement
 * @customElement
 * @appliesMixin EsmmMixins.ListItemUtils
 */
@customElement('esmm-selected-options')
export class EsmmSelectedOptions extends ListItemUtils(LitElement) {
  @property({type: Array})
  selectedItems: any[] = [];

  @property({type: String, attribute:'label'})
  label: string = '';

  @property({type: Boolean, attribute:'no-label-float'})
  noLabelFloat = false;

  @property({type: Boolean, attribute:'always-float-label'})
  alwaysFloatLabel = false;

  @property({type: String, attribute:'placeholder'})
  placeholder: string = '';

  @property({type: Boolean, attribute:'auto-validate'})
  autoValidate = false;

  @property({type: Boolean, attribute: 'readonly', reflect: true})
  readonly = false;

  @property({type: Boolean, attribute:'disabled', reflect: true})
  disabled = false;

  @property({type: Boolean, attribute:'invalid', reflect: true})
  invalid = false;

  @property({type: String, attribute:'error-message'})
  errorMessage: String = '';

  @property({type: Boolean})
  _hidePlaceholder = false;

  @property({type: Object})
  openMenu: any;

  @property({type: Object})
  onInputFocus: any;

  render() {
    // language=HTML
    return html`
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
            this.selectedItems.map(
              (item) => html`
                <span class="selected-item">
                  <span>${this.getLabel(item)}</span>
                  <span class="readonly-separator" ?hidden="${!this.readonly}">|</span>
                  <paper-icon-button
                    id="iconRemoveSelected"
                    ?disabled="${this.disabled}"
                    ?hidden="${this.readonly}"
                    icon="close"
                    @tap="${(e: CustomEvent) => this._removeItem(e, item)}"
                    @focus="${this._onXFocus}"
                  ></paper-icon-button>
                </span>
              `
            )}
          </div>
        </div>

        <iron-icon icon="arrow-drop-down" slot="suffix" ?hidden="${this.readonly}"></iron-icon>
        <paper-input-error aria-live="assertive" slot="add-on" ?hidden="${!this.errorMessage}"
          >${this.errorMessage}</paper-input-error
        >
      </paper-input-container>
    `;
  }

  updated(changedProperties: any){
    if(changedProperties.has('selectedItems')){
      this._selectedItemsDisplayHasChanged();
    }
  }

  /**
   * @param alwaysFloatLabel
   * @param placeholder
   * @returns {*}
   * @private
   */
  _computeAlwaysFloatLabel(alwaysFloatLabel: boolean, placeholder: string) {
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
    } else {
      this._hidePlaceholder = false;
    }

    // Notifies paper-dialog to center its self
    this.dispatchEvent(
      new CustomEvent('iron-resize', {
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * @event remove-selected-item
   * @param e
   * @private
   */
  _removeItem(e: CustomEvent, item: any) {
    // fire remove event to parent
    this._stopEvent(e);
    this.dispatchEvent(
      new CustomEvent('remove-selected-item', {
        detail: item[this.optionValue],
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * @param e
   * @private
   */
  _onXFocus(e: CustomEvent) {
    this._stopEvent(e);
  }

  _stopEvent(e: CustomEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}
