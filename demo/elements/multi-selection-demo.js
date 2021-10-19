import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import {TestData} from '../mixins/test-data-mixin.js';
import './demo-actions.js';
import '../../etools-dropdown-multi.js';

/* eslint-disable */
/**
 * @customElement
 * @polymer
 * @appliesMixin EsmmDemoHelpers.TestData
 */
class EsmmMultiSelectionDemo extends TestData(PolymerElement) {
  static get template() {
    // language=HTML
    return html`
      <style>
        .demo-field + .demo-field {
          margin-left: 24px;
        }

        div {
          display: inline-block;
          width: 100%;
        }
      </style>
      <div>
        <etools-dropdown-multi
          id="dropDown1"
          class="demo-field"
          label="Multi selection"
          options="[[simpleOptions]]"
        ></etools-dropdown-multi>
      </div>
      <div>
        <etools-dropdown-multi
          id="dropDown2"
          class="demo-field"
          label="Multi selection, multi-lines options"
          options="[[twoLineOptions]]"
          two-lines-label=""
        ></etools-dropdown-multi>
      </div>

      <esmm-demo-actions id="demoActions"></esmm-demo-actions>
    `;
  }

  static get is() {
    return 'esmm-multi-selection-demo';
  }

  static get properties() {
    return {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.demoActions.set('dropdownsIds', [this.$.dropDown1, this.$.dropDown2]);
  }
}

window.customElements.define(EsmmMultiSelectionDemo.is, EsmmMultiSelectionDemo);
