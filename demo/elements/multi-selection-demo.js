import {LitElement, html} from 'lit-element';
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
class EsmmMultiSelectionDemo extends TestData(LitElement) {
  render() {
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
          .options="${this.simpleOptions}"
          no-dynamic-align
          hide-search
          horizontal-align="left"
          vertical-offset="300"
        ></etools-dropdown-multi>
      </div>
      <div>
        <etools-dropdown-multi
          id="dropDown2"
          class="demo-field"
          label="Multi selection, multi-lines options"
          .options="${this.twoLineOptions}"
          two-lines-label
          no-dynamic-align
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

  firstUpdate() {
    this.shadowRoot.querySelector('#demoActions').dropdownsIds = [
      this.shadowRoot.querySelector('#dropDown1'), 
      this.shadowRoot.querySelector('#dropDown2')
    ];
  }
}

window.customElements.define(EsmmMultiSelectionDemo.is, EsmmMultiSelectionDemo);
