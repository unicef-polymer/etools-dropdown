import {LitElement, html} from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import {TestData} from '../mixins/test-data-mixin.js';
import './demo-actions.js';
import '../../etools-dropdown.js';

/* eslint-disable */
/**
 * @customElement
 * @polymer
 * @appliesMixin EsmmDemoHelpers.TestData
 */
class EsmmSingleSelectionDemo extends TestData(LitElement) {
  render() {
    // language=HTML
    return html`
      <style>
        .demo-field + .demo-field {
          margin-left: 24px;
        }
      </style>

      <div>
        <etools-dropdown
          id="dropDown1"
          class="demo-field"
          label="Single selection"
          .options="${this.simpleOptions}"
          enable-none-option
          show-limit-warning
          shown-options-limit
        ></etools-dropdown>
      </div>
      <div>
        <etools-dropdown
          id="dropDown2"
          class="demo-field"
          label="Single selection, multi-lines options"
          .options="${this.twoLineOptions}"
          two-lines-label
          enable-none-option
        ></etools-dropdown>
      </div>

      <esmm-demo-actions id="demoActions"></esmm-demo-actions>
    `;
  }

  static get is() {
    return 'esmm-single-selection-demo';
  }

  static get properties() {
    return {};
  }

  firstUpdated() {
    this.shadowRoot.querySelector('#demoActions').dropdownsIds = [
      this.shadowRoot.querySelector('#dropDown1'), 
      this.shadowRoot.querySelector('#dropDown2')
    ];
  }
}

customElements.define(EsmmSingleSelectionDemo.is, EsmmSingleSelectionDemo);
