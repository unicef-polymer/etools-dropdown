import {LitElement, html} from 'lit-element';
import '@polymer/paper-button/paper-button.js';

/* eslint-disable */
/**
 * @polymer
 * @customElement
 */
class EsmmDemoActions extends LitElement {
  render() {
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
        <paper-button raised @tap="${this.validateDropdowns}">Validate</paper-button>
        <paper-button raised class="${this.autoValidateActiveClass}" @tap="${this.activateAutoValidation}"
          >Enable auto validation
        </paper-button>
        <paper-button raised @tap="${this.deactivateAutoValidation}">Disable auto validation</paper-button>
      </div>
      <div>
        <paper-button raised @tap="${this.makeDropdownsRequired}" class="${this.requiredActiveClass}">
          Make dropdowns required
        </paper-button>
        <paper-button raised @tap="${this.makeDropdownsNotRequired}">Make dropdowns NOT required</paper-button>
      </div>
      <div>
        <paper-button raised @tap="${this.makeDropdownsReadonly}" class="${this.readonlyActiveClass}"
          >Make dropdowns readonly
        </paper-button>
        <paper-button raised @tap="${this.removeReadonlyState}">Make dropdowns editable</paper-button>
      </div>
      <div>
        <paper-button raised @tap="${this.activateInvalidState}">Activate invalid state</paper-button>
        <paper-button raised @tap="${this.deactivateInvalidState}">Hide invalid state</paper-button>
      </div>
      <div>
        <paper-button raised @tap="${this.disableDropdowns}" class="${this.disabledActiveClass}">Disable</paper-button>
        <paper-button raised @tap="${this.enableDropdowns}">Enable</paper-button>
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
      drId.required = true;
    });
    this.requiredActiveClass = 'active';
  }

  makeDropdownsNotRequired() {
    this.dropdownsIds.forEach((drId) => {
      drId.required = false;
    });
    this.requiredActiveClass = '';
  }

  activateAutoValidation() {
    this.dropdownsIds.forEach((drId) => {
      drId.autoValidate = true;
    });
    this.autoValidateActiveClass = 'active';
  }

  deactivateAutoValidation() {
    this.dropdownsIds.forEach((drId) => {
      drId.autoValidate = false;
    });
    this.autoValidateActiveClass = '';
  }

  validateDropdowns() {
    this.dropdownsIds.forEach((drId) => {
      drId.validate();
    });
  }

  makeDropdownsReadonly() {
    this.dropdownsIds.forEach((drId) => {
      drId.readonly = true;
    });
    this.readonlyActiveClass = 'active';
  }

  removeReadonlyState() {
    this.dropdownsIds.forEach((drId) => {
      drId.readonly = false;
    });
    this.readonlyActiveClass = '';
  }

  activateInvalidState() {
    this.dropdownsIds.forEach((drId) => {
      drId.invalid = true;
    });
  }

  deactivateInvalidState() {
    this.dropdownsIds.forEach((drId) => {
      drId.invalid = false;
    });
  }

  disableDropdowns() {
    this.dropdownsIds.forEach((drId) => {
      drId.disabled = true;
    });
    this.disabledActiveClass = 'active';
  }

  enableDropdowns() {
    this.dropdownsIds.forEach((drId) => {
      drId.disabled = false;
    });
    this.disabledActiveClass = '';
  }
}

customElements.define(EsmmDemoActions.is, EsmmDemoActions);
