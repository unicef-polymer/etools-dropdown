import '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
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

      #ironDrContent {
        background-color: var(--esmm-bg-color, #ffffff);
        overflow: hidden;
      }

      #optionsList {
        overflow-x: hidden;
        overflow-y: auto;
      }

    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
