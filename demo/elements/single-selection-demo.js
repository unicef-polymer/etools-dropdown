import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
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
class EsmmSingleSelectionDemo extends TestData(PolymerElement) {
  static get template() {
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
          options="[[simpleOptions]]"
          enable-none-option
          show-limit-warning
          shown-options-limit="6"
        ></etools-dropdown>
      </div>
      <div>
        <etools-dropdown
          id="dropDown2"
          class="demo-field"
          label="Single selection, multi-lines options"
          options="[[twoLineOptions]]"
          two-lines-label=""
          enable-none-option=""
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

  connectedCallback() {
    super.connectedCallback();
    this.$.demoActions.set('dropdownsIds', [this.$.dropDown1, this.$.dropDown2]);
  }
}

window.customElements.define(EsmmSingleSelectionDemo.is, EsmmSingleSelectionDemo);
