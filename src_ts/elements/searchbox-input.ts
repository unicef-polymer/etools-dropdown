import {LitElement, html, customElement, property} from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input-container.js';
import {getTranslation} from '../utils/translate';
import {ifDefined} from 'lit-html/directives/if-defined.js';

/**
 * @customElement
 * @polymer
 */
@customElement('esmm-searchbox-input')
export class EsmmSearchboxInput extends LitElement {
  @property({type: String})
  search = '';

  @property({type: String})
  language = 'en';

  render() {
    // language=HTML
    return html`
      <style>
        :host {
          @apply --layout-horizontal;
          @apply --layout-wrap;
          padding: 8px 16px;
          box-sizing: border-box;
        }

        iron-icon {
          margin-inline-end: 5px;
        }

        #searchInputContainer {
          width: 100%;

          --paper-input-container-label: {
            @apply --esmm-search-input-label;
          }
        }
      </style>

      <paper-input-container id="searchInputContainer" no-label-float type="text" tabindex="${ifDefined(undefined)}">
        <iron-icon icon="search" slot="prefix"></iron-icon>
        <input
          slot="input"
          id="searchInput"
          .value="${this.search}"
          placeholder="${getTranslation(this.language, 'SEARCH')}"
          @input="${this._valueChanged}"
        />
      </paper-input-container>
    `;
  }

  _valueChanged(e: CustomEvent) {
    this.search = (e.target as HTMLInputElement).value;
    this.dispatchEvent(
      new CustomEvent('search-changed', {
        detail: {value: (e.target as HTMLInputElement).value},
        bubbles: true,
        composed: true
      })
    );
  }
}
