import {html} from 'lit-element';

// language=HTML
export const esmmSharedStyles = html` <style>
  html {
    --esmm-icons: {
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    --esmm-select-cursor: pointer;

    --paper-item-focused-before: {
      opacity: 0.06;
    }
    --paper-item-focused-after: {
      opacity: 0.06;
    }
  }

  *[hidden] {
    display: none !important;
  }

  :host {
    position: relative;
    width: 242px;
    @apply --layout-horizontal;
    @apply --esmm-external-wrapper;
  }

  :host(:not([readonly]):not([disabled])) {
    cursor: var(--esmm-select-cursor);
  }

  #dropdownMenu {
    position: var(--esmm-dropdown-menu-position, absolute) !important;
    display: flex;
    flex-direction: column;
    z-index: var(--esmm-dropdown-menu-z-index, initial);
    top: 0 !important;
    left: 0 !important;
  }

  #ironDrContent {
    background-color: var(--esmm-bg-color, #ffffff);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-height: 48px;
  }

  #optionsList {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 100vh !important;
  }

  .rounded {
    border-radius: 4px;
  }

  html {
    --paper-material: {
      display: block;
      position: relative;
    }
    --paper-material-elevation-1: {
      @apply --shadow-elevation-2dp;
    }
    --paper-material-elevation-2: {
      @apply --shadow-elevation-4dp;
    }
    --paper-material-elevation-3: {
      @apply --shadow-elevation-6dp;
    }
    --paper-material-elevation-4: {
      @apply --shadow-elevation-8dp;
    }
    --paper-material-elevation-5: {
      @apply --shadow-elevation-16dp;
    }
  }
  .paper-material {
    @apply --paper-material;
  }
  .paper-material[elevation='1'] {
    @apply --paper-material-elevation-1;
  }
  .paper-material[elevation='2'] {
    @apply --paper-material-elevation-2;
  }
  .paper-material[elevation='3'] {
    @apply --paper-material-elevation-3;
  }
  .paper-material[elevation='4'] {
    @apply --paper-material-elevation-4;
  }
  .paper-material[elevation='5'] {
    @apply --paper-material-elevation-5;
  }

  /* Duplicate the styles because of https://github.com/webcomponents/shadycss/issues/193 */
  :host {
    --paper-material: {
      display: block;
      position: relative;
    }
    --paper-material-elevation-1: {
      @apply --shadow-elevation-2dp;
    }
    --paper-material-elevation-2: {
      @apply --shadow-elevation-4dp;
    }
    --paper-material-elevation-3: {
      @apply --shadow-elevation-6dp;
    }
    --paper-material-elevation-4: {
      @apply --shadow-elevation-8dp;
    }
    --paper-material-elevation-5: {
      @apply --shadow-elevation-16dp;
    }
  }
  :host(.paper-material) {
    @apply --paper-material;
  }
  :host(.paper-material[elevation='1']) {
    @apply --paper-material-elevation-1;
  }
  :host(.paper-material[elevation='2']) {
    @apply --paper-material-elevation-2;
  }
  :host(.paper-material[elevation='3']) {
    @apply --paper-material-elevation-3;
  }
  :host(.paper-material[elevation='4']) {
    @apply --paper-material-elevation-4;
  }
  :host(.paper-material[elevation='5']) {
    @apply --paper-material-elevation-5;
  }
</style>`;
