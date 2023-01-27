import {LitElement, html} from 'lit-element';
import '@unicef-polymer/etools-dialog/etools-dialog.js';
import './multi-selection-demo.js';
import './single-selection-demo.js';

/* eslint-disable */
/**
 * @customElement
 * @polymer
 * @demo demo/index-dialog.html
 */
class DropdownDialogDemo extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        [hidden] {
          display: none !important;
        }

        .vertical-section-container {
          max-width: 900px;
        }
      </style>

      <etools-dialog id="demoDialog" size="lg" .opened="${this.opened}">
        <div class="vertical-section-container centered">
          <h3>etools-dropdown: single selection demo</h3>
          <esmm-single-selection-demo></esmm-single-selection-demo>
        </div>
        <div class="vertical-section-container centered">
          <h3>etools-dropdown: multi selection demo</h3>
          <esmm-multi-selection-demo></esmm-multi-selection-demo>
        </div>
      </etools-dialog>
    `;
  }

  static get is() {
    return 'dropdown-dialog-demo';
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: true
      }
    };
  }

  open() {
    this.shadowRoot.querySelector('#demoDialog').opened = true;
  }

  firstUpdated() {
    this.open();
  }
}

window.customElements.define(DropdownDialogDemo.is, DropdownDialogDemo);
