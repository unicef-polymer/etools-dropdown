import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
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
 * @polymer
 * @customElement
 * @extends {ListItemUtils}
 */
class EsmmSelectedOptions extends ListItemUtils(PolymerElement) {
  static get template() {
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

      </style>

      <paper-input-container id="container" tabindex="1" no-label-float="[[noLabelFloat]]"
                             always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel, placeholder)]]"
                             auto-validate\$="[[autoValidate]]" disabled\$="[[disabled]]" invalid="[[invalid]]">

        <label hidden\$="[[!label]]" aria-hidden="true" for="selected-items-wrapper" slot="label">[[label]]</label>

        <div slot="input" class="paper-input-input">
        <span class="placeholder" hidden\$="[[_hidePlaceholder]]">
          [[placeholder]]
        </span>
          <div id="selected-items-wrapper" hidden\$="[[!_hidePlaceholder]]">

            <template is="dom-repeat" notify-dom-change="" on-dom-change="_selectedItemsDisplayHasChanged"
                      items="[[selectedItems]]">
            <span class="selected-item">
              <span>[[getLabel(item)]]</span>
              <span class="readonly-separator" hidden\$="[[!readonly]]">|</span>
              <paper-icon-button id="iconRemoveSelected" disabled\$="[[disabled]]" hidden\$="[[readonly]]"
                                 icon="close" on-tap="_removeItem" on-focus="_onXFocus"></paper-icon-button>
            </span>
            </template>

          </div>
        </div>

        <iron-icon icon="arrow-drop-down" slot="suffix" hidden\$="[[readonly]]"></iron-icon>

        <template is="dom-if" if="[[errorMessage]]">
          <paper-input-error aria-live="assertive" slot="add-on">[[errorMessage]]</paper-input-error>
        </template>

      </paper-input-container>
    `;
  }

  static get is() {
    return 'esmm-selected-options';
  }

  static get properties() {
    return {
      selectedItems: Array,
      label: String,
      noLabelFloat: Boolean,
      alwaysFloatLabel: Boolean,
      placeholder: String,
      autoValidate: Boolean,
      readonly: {
        type: Boolean,
        reflectToAttribute: true
      },
      disabled: Boolean,
      invalid: Boolean,
      errorMessage: String,
      _hidePlaceholder: Boolean
    };
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
  _selectedItemsDisplayHasChanged(e) {
    this._stopEvent(e);
    // hide/show placeholder
    if (this.selectedItems instanceof Array && this.selectedItems.length > 0) {
      this.set('_hidePlaceholder', true);
    } else {
      this.set('_hidePlaceholder', false);
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
  _removeItem(e) {
    // fire remove event to parent
    this._stopEvent(e);
    this.dispatchEvent(new CustomEvent('remove-selected-item', {
      detail: e.model.item[this.optionValue],
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
}

window.customElements.define(EsmmSelectedOptions.is, EsmmSelectedOptions);
