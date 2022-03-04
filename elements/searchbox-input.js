import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';

/**
 * @customElement
 * @polymer
 */
class EsmmSearchboxInput extends PolymerElement {
  static get template() {
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
        no-label-float=""
        placeholder="Search"
        type="text"
        value="[[search]]"
        on-value-changed="_valueChanged"
        auto-focus=""
        tabindex="0"
      >
        <iron-icon icon="search" slot="prefix"></iron-icon>
      </paper-input>
    `;
  }

  static get is() {
    return 'esmm-searchbox-input';
  }

  static get properties() {
    return {
      /** Search string property */
      search: {
        type: String,
        notify: true
      }
    };
  }

  _valueChanged(e){
    this.search = e.detail.value;
    this.dispatchEvent(
      new CustomEvent('search-changed', {
        detail: e.detail,
        bubbles: true,
        composed: true
      })
    );
  }
}

window.customElements.define(EsmmSearchboxInput.is, EsmmSearchboxInput);
