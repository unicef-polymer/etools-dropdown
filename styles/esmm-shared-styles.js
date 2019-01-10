import {html} from '@polymer/polymer/polymer-element';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

export const EsmmSharedStyles = html`
  <style>
    /* esmm global styles */
    html {
      --esmm-icons: {
        color: var(--secondary-text-color);
        cursor: pointer;
      };
      --esmm-select-cursor: pointer;
    }

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
      position: absolute !important;
    }

    #dropdownMenu {
      position: absolute !important;
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
  `;
