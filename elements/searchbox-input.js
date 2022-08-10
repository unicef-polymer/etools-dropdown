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
        placeholder="[[getTranslation(language, 'SEARCH')]]"
        type="text"
        value="{{search}}"
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
      },
      language: {
        type: String,
        value: 'en'
      }
    };
  }
}

window.customElements.define(EsmmSearchboxInput.is, EsmmSearchboxInput);
