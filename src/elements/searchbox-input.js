var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property } from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import { getTranslation } from '../utils/translate';
/**
 * @customElement
 * @polymer
 */
let EsmmSearchboxInput = class EsmmSearchboxInput extends LitElement {
    constructor() {
        super(...arguments);
        this.search = '';
        this.language = 'en';
    }
    render() {
        // language=HTML
        return html `
      <style>
        :host {
          @apply --layout-horizontal;
          @apply --layout-wrap;
          padding: 8px 16px;
          box-sizing: border-box;
        }

        iron-icon {
          margin-right: 5px;
        }

        paper-input {
          width: 100%;

          --paper-input-container-label: {
            @apply --esmm-search-input-label;
          }
        }
      </style>

      <paper-input
        id="searchInput"
        no-label-float
        placeholder="${this.getTranslation('SEARCH')}"
        type="text"
        .value="${this.search}"
        @value-changed="${this._valueChanged}"
        auto-focus
        tabindex="0"
      >
        <iron-icon icon="search" slot="prefix"></iron-icon>
      </paper-input>
    `;
    }
    _valueChanged(e) {
        this.search = e.detail.value;
        this.dispatchEvent(new CustomEvent('search-changed', {
            detail: e.detail,
            bubbles: true,
            composed: true
        }));
    }
    getTranslation(key) {
        return getTranslation(this.language, key);
    }
};
__decorate([
    property({ type: String })
], EsmmSearchboxInput.prototype, "search", void 0);
__decorate([
    property({ type: String })
], EsmmSearchboxInput.prototype, "language", void 0);
EsmmSearchboxInput = __decorate([
    customElement('esmm-searchbox-input')
], EsmmSearchboxInput);
export { EsmmSearchboxInput };
