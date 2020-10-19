import '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
// eslint-disable-next-line
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<custom-style>
  <style>
    /* esmm global styles */
    html {

      --esmm-icons: {
        color: var(--secondary-text-color);
        cursor: pointer;
      };

      --esmm-select-cursor: pointer;

      --paper-item-focused-before: {
        opacity: 0.06;
      };
      --paper-item-focused-after: {
        opacity: 0.06;
      };

    }
  </style>
</custom-style><dom-module id="esmm-shared-styles">
  <template>
    <style>
      *[hidden] {
        display: none !important;
      }

      :host {
        width: 242px;
        @apply --layout-horizontal;
        @apply --esmm-external-wrapper;
      }

      :host(:not([readonly])), :host(:not([disabled])) {
        cursor: var(--esmm-select-cursor);
      }

      #dropdownMenu {
        position: var(--esmm-dropdown-menu-position, absolute) !important;
        display: flex;
        flex-direction: column;
      }

      #ironDrContent {
        background-color: var(--esmm-bg-color, #ffffff);
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      #optionsList {
        overflow-x: hidden;
        overflow-y: auto;
      }

    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
