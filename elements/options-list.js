import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/paper-item/paper-item-body.js';
import {ListItemUtils} from '../mixins/list-item-utils-mixin.js';

/**
 * @customElement
 * @polymer
 * @appliesMixin EsmmMixins.ListItemUtils
 */
class EsmmOptionsList extends ListItemUtils(PolymerElement) {
  static get template() {
    // language=HTML
    return html`
      <style>
        :host {
          display: block;

          --paper-item-icon: {
            width: auto;
            margin-right: 8px;
          };
        }

        paper-listbox {
          width: 100%;
          padding: 0;
        }

        paper-icon-item {
          cursor: var(--esmm-select-cursor);
          height: 48px; /* for IE */
        }

        paper-icon-item .tick-icon {
          display: none;
        }

        paper-icon-item.iron-selected {
          background: var(--esmm-list-item-selected-color, #dcdcdc);
        }

        paper-icon-item.iron-selected .tick-icon {
          display: flex;
        }

        .warning {
          font-family: Roboto;
          font-size: 12px;
          line-height: 16px;
          color: rgba(0, 0, 0, 0.54);
          background-color: #EEEEEE;
          padding-top: 8px;
          padding-bottom: 8px;
        }

        paper-icon-item.esmm-none-option {
          color: rgba(0, 0, 0, 0.38);
        }
      </style>

      <paper-listbox multi="[[multi]]" attr-for-selected="internal-id" selected="[[selected]]"
                     selected-values="{{selectedValues}}">
        <template is="dom-repeat" items="[[shownOptions]]">
          <paper-icon-item disabled\$="[[item.disableSelection]]" internal-id\$="[[getValue(item)]]"
                           on-tap="_itemSelected" class\$="[[item.cssClass]] [[_getSelectedClass(item)]]"
                           title\$="[[_getItemTitle(item)]]">

            <iron-icon class="tick-icon" icon="check" slot="item-icon"></iron-icon>
            <paper-item-body two-line\$="[[twoLinesLabel]]">

              <template is="dom-if" if="[[twoLinesLabel]]">
                <div>[[getPrimaryLabel(item.label)]]</div>
                <div secondary="">[[getSecondaryLabel(item.label)]]</div>
              </template>

              <template is="dom-if" if="[[!twoLinesLabel]]">
                <span>[[getLabel(item)]]</span>
              </template>

            </paper-item-body>

          </paper-icon-item>

        </template>

        <paper-item hidden\$="[[!showNoSearchResultsWarning]]" class="warning" disabled="">
          No results found. Try other keywords.
        </paper-item>

        <paper-item hidden\$="[[!showLimitWarning]]" class="warning" disabled="">
          More than [[shownOptionsLimit]] items, use the search function to reveal more.
        </paper-item>

        <paper-item hidden\$="[[!noOptionsAvailable]]" class="warning" disabled="">
          No options available.
        </paper-item>
      </paper-listbox>
    `;
  }

  static get is() {
    return 'esmm-options-list';
  }

  static get properties() {
    return {
      /** Multi selection flag. If true `selectedValues` array will be used instead `selected` */
      multi: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /** paper-listbox selected value is `multi` is false */
      selected: {
        type: String,
        notify: true
      },
      /** paper-listbox selected values is `multi` is true */
      selectedValues: {
        type: Array,
        notify: true
      },
      /** Array of options to be shown in dropdown */
      shownOptions: Array,
      /** Flag used to show no search result found warning */
      showNoSearchResultsWarning: Boolean,
      /** Flag to show the limit of options shown in dropdown */
      showLimitWarning: Boolean,
      /** Flag to show a no options avaliable warning */
      noOptionsAvailable: Boolean,

      shownOptionsLimit: Number
    };
  }

  /**
   * @event close-etools-dropdown
   * @param e
   * @private
   */
  _itemSelected(e) {
    if (this.multi) {
      if (!this.selectedValues) {
        this.selectedValues = [];
      }
    } else {
      e.stopImmediatePropagation();
      let selectedValue = e.model.item[this.optionValue];
      this.set('selected', selectedValue);
      this.dispatchEvent(new CustomEvent('close-etools-dropdown', {
        bubbles: true,
        composed: true
      }));
    }
  }

  /**
   *
   * @param item
   * @returns {*}
   * @private
   */
  _getItemTitle(item) {
    return item[this.optionLabel];
  }

  /**
   * Use of this method covers a corner case
   * @param item
   * @returns {*}
   * @private
   */
  _getSelectedClass(item) {
    return !this.multi ? this._getSelectedClassSingle(item) : this._getSelectedClassMulti(item);
  }

  /**
   * Return `iron-selected` CSS class if needed
   * @param item
   * @returns {string}
   * @private
   */
  _getSelectedClassSingle(item) {
    return (this.selected && this.selected === item[this.optionValue]) ? 'iron-selected' : '';
  }

  /**
   * Return `iron-selected` CSS class if needed for multi selection dropdown
   * @param item
   * @returns {*}
   * @private
   */
  _getSelectedClassMulti(item) {
    if (this.selectedValues instanceof Array && this.selectedValues.length > 0) {
      return this.selectedValues.indexOf(this._getItemValueByOptionValue(item).toString()) > -1 ? 'iron-selected' : '';
    }
    return '';
  }

  _getItemValueByOptionValue(item) {
    let val = item[this.optionValue];
    if (val === null || val === undefined) {
      return -1;
    }
    return val;
  }
}

window.customElements.define(EsmmOptionsList.is, EsmmOptionsList);
