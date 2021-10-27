import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';

/* eslint-disable */
/**
 * @polymer
 * @customElement
 */
class EsmmDemoActions extends PolymerElement {
  static get template() {
    // language=HTML
    return html`
      <style>
        :host {
          /* host CSS */
        }

        div {
          margin: 15px 0;
        }

        div:first-of-type {
          margin-top: 40px;
        }

        paper-button:first-child {
          margin-left: 0;
        }

        paper-button.active {
          background-color: #009a54;
          color: #fff;
        }
      </style>

      <div>
        <paper-button raised="" on-tap="validateDropdowns">Validate</paper-button>
        <paper-button raised="" class$="[[autoValidateActiveClass]]" on-tap="activateAutoValidation"
          >Enable auto validation
        </paper-button>
        <paper-button raised="" on-tap="deactivateAutoValidation">Disable auto validation</paper-button>
      </div>
      <div>
        <paper-button raised="" on-tap="makeDropdownsRequired" class$="[[requiredActiveClass]]">
          Make dropdowns required
        </paper-button>
        <paper-button raised="" on-tap="makeDropdownsNotRequired">Make dropdowns NOT required</paper-button>
      </div>
      <div>
        <paper-button raised="" on-tap="makeDropdownsReadonly" class$="[[readonlyActiveClass]]"
          >Make dropdowns readonly
        </paper-button>
        <paper-button raised="" on-tap="removeReadonlyState">Make dropdowns editable</paper-button>
      </div>
      <div>
        <paper-button raised="" on-tap="activateInvalidState">Activate invalid state</paper-button>
        <paper-button raised="" on-tap="deactivateInvalidState">Hide invalid state</paper-button>
      </div>
      <div>
        <paper-button raised="" on-tap="disableDropdowns" class$="[[disabledActiveClass]]">Disable</paper-button>
        <paper-button raised="" on-tap="enableDropdowns">Enable</paper-button>
      </div>
    `;
  }

  static get is() {
    return 'esmm-demo-actions';
  }

  static get properties() {
    return {
      /**
       * @type {Array<HTMLElement>}
       */
      dropdownsIds: {
        type: Array,
        value: []
      },
      requiredActiveClass: String,
      autoValidateActiveClass: String,
      readonlyActiveClass: String,
      disabledActiveClass: String
    };
  }

  makeDropdownsRequired() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('required', true);
    });
    this.set('requiredActiveClass', 'active');
  }

  makeDropdownsNotRequired() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('required', false);
    });
    this.set('requiredActiveClass', '');
  }

  activateAutoValidation() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('autoValidate', true);
    });
    this.set('autoValidateActiveClass', 'active');
  }

  deactivateAutoValidation() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('autoValidate', false);
    });
    this.set('autoValidateActiveClass', '');
  }

  validateDropdowns() {
    this.dropdownsIds.forEach((drId) => {
      drId.validate();
    });
  }

  makeDropdownsReadonly() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('readonly', true);
    });
    this.set('readonlyActiveClass', 'active');
  }

  removeReadonlyState() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('readonly', false);
    });
    this.set('readonlyActiveClass', '');
  }

  activateInvalidState() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('invalid', true);
    });
  }

  deactivateInvalidState() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('invalid', false);
    });
  }

  disableDropdowns() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('disabled', true);
    });
    this.set('disabledActiveClass', 'active');
  }

  enableDropdowns() {
    this.dropdownsIds.forEach((drId) => {
      drId.set('disabled', false);
    });
    this.set('disabledActiveClass', '');
  }
}

window.customElements.define(EsmmDemoActions.is, EsmmDemoActions);
