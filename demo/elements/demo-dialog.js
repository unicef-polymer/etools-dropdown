import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '../../../etools-dialog/etools-dialog.js';
import './multi-selection-demo.js';
import './sigle-selection-demo.js';

/* eslint-disable */
/**
 * @customElement
 * @polymer
 */
class DropdownDialogDemo extends PolymerElement {
  static get template() {
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

      <etools-dialog id="demoDialog" size="lg" opened="[[opened]]">
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
    this.$.demoDialog.opened = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.open();
  }
}

window.customElements.define(DropdownDialogDemo.is, DropdownDialogDemo);
