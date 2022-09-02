var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, property, customElement } from 'lit-element';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/paper-item/paper-item-body.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { ListItemUtilsMixin } from '../mixins/list-item-utils-mixin.js';
import '@polymer/paper-spinner/paper-spinner';
/**
 * @customElement
 * @polymer
 * @appliesMixin EsmmMixins.ListItemUtils
 */
let EsmmOptionsList = class EsmmOptionsList extends ListItemUtilsMixin(LitElement) {
    constructor() {
        super(...arguments);
        /** The current number of shown options, it increases by shownOptionsLimit when user scrolls down */
        this.shownOptionsCount = 0;
        /** Multi selection flag. If true `selectedValues` array will be used instead `selected` */
        this.multi = false;
        /** paper-listbox selected value is `multi` is false */
        this.selected = '';
        /** paper-listbox selected values is `multi` is true */
        this.selectedValues = [];
        /** Array of options to be shown in dropdown */
        this.shownOptions = [];
        /** Flag used to show no search result found warning */
        this.showNoSearchResultsWarning = false;
        /** Flag to show the limit of options shown in dropdown */
        this.showLimitWarning = false;
        this.requestInProgress = false;
        /** Flag to show a no options avaliable warning */
        this.noOptionsAvailable = false;
        this.shownOptionsLimit = 0;
        this._debouncer = null;
    }
    render() {
        // language=HTML
        return html `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          width: 100%;

          --paper-item-icon: {
            width: auto;
            margin-right: 8px;
          }
        }

        paper-listbox {
          flex-grow: 1;
          overflow: auto;
          min-height: 0;
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

        paper-icon-item .check-box {
          display: flex;
          color: var(--secondary-text-color);
        }

        paper-icon-item.iron-selected {
          background: var(--esmm-list-item-selected-color, #dcdcdc);
        }

        paper-icon-item.iron-selected .tick-icon {
          display: flex;
          color: var(--primary-color);
        }

        paper-icon-item.iron-selected .check-box {
          display: none;
        }

        paper-item,
        paper-icon-item {
          overflow: hidden;
        }

        .warning {
          font-family: Roboto;
          font-size: 12px;
          line-height: 16px;
          color: rgba(0, 0, 0, 0.54);
          background-color: #eeeeee;
          padding-top: 8px;
          padding-bottom: 8px;
        }

        paper-icon-item.esmm-none-option {
          color: rgba(0, 0, 0, 0.38);
        }
      </style>

      <paper-listbox
        id="options-listbox"
        .multi="${this.multi}"
        attr-for-selected="internal-id"
        .selected="${this.selected}"
        .selectedValues="${this.selectedValues}"
        @selected-values-changed=${this._selectedValuesChanged}
      >
        ${this.shownOptions.map((item) => html `
            <paper-icon-item
              ?disabled="${item.disableSelection}"
              internal-id="${this.getValue(item)}"
              @tap="${(e) => this._itemSelected(e, item)}"
              class="${this._getSelectedClass(item)}"
              title="${this._getItemTitle(item)}"
            >
              <iron-icon
                class="check-box"
                icon="check-box-outline-blank"
                slot="item-icon"
                ?hidden="${!this.multi}"
              ></iron-icon>
              <iron-icon class="tick-icon" icon="check-box" slot="item-icon" ?hidden="${!this.multi}"></iron-icon>
              <iron-icon class="tick-icon" icon="check" slot="item-icon" ?hidden="${this.multi}"></iron-icon>

              <paper-item-body two-line="${this.twoLinesLabel}">
                <div ?hidden="${!this.twoLinesLabel}">${this.getPrimaryLabel(item.label)}</div>
                <div ?hidden="${!this.twoLinesLabel}" secondary="">${this.getSecondaryLabel(item.label)}</div>
                <span ?hidden="${this.twoLinesLabel}">${this.getLabel(item)}</span>
              </paper-item-body>
            </paper-icon-item>
          `)}

        <paper-item ?hidden="${!this.showNoSearchResultsWarning}" class="warning" disabled>
          ${this.getTranslation('NO_RESULTS_FOUND_TRY_OTHER_KEYWORDS')}
        </paper-item>

        <paper-item ?hidden="${!this.requestInProgress}" class="warning" disabled>
          ${this.getTranslation('REQUEST_IN_PROGRESS')}
          <paper-spinner active></paper-spinner>
        </paper-item>

        <paper-item id="infinite-scroll-trigger" ?hidden="${!this.showLimitWarning}" class="warning" disabled>
          ${this.getTranslation('SCROLL_DOWN_TO_REVEAL_MORE_ITEMS')}
          <paper-spinner active></paper-spinner>
        </paper-item>

        <paper-item ?hidden="${!this.noOptionsAvailable}" id="noOptions" class="warning" disabled>
          ${this.getTranslation('NO_OPTIONS_AVAILABLE')}
        </paper-item>
      </paper-listbox>
    `;
    }
    updated(changedProperties) {
        if (changedProperties.has('showLimitWarning')) {
            this._enableInfiniteScroll();
        }
    }
    _enableInfiniteScroll() {
        var _a, _b;
        var options = {
            root: (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#options-listbox'),
            treshold: 1.0
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this._debouncer = Debouncer.debounce(this._debouncer, timeOut.after(100), () => {
                        this.showMoreOptions();
                    });
                }
            });
        }, options);
        observer.observe((_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#infinite-scroll-trigger'));
    }
    showMoreOptions() {
        if (!this.shownOptions || !this.shownOptions.length) {
            this.shownOptionsCount = this.shownOptionsLimit;
            return;
        }
        this.shownOptionsCount += this.shownOptionsLimit;
        this.dispatchEvent(new CustomEvent('show-more', {
            detail: this.shownOptionsCount,
            bubbles: true,
            composed: true
        }));
    }
    /**
     * @event close-etools-dropdown
     * @param e
     * @private
     */
    _itemSelected(e, item) {
        if (this.multi) {
            if (!this.selectedValues) {
                this.selectedValues = [];
            }
        }
        else {
            e.stopImmediatePropagation();
            const selectedValue = item[this.optionValue];
            this.selected = selectedValue;
            this.dispatchEvent(new CustomEvent('selected-changed', {
                detail: { value: this.selected },
                bubbles: true,
                composed: true
            }));
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
        const classes = [];
        if (item.cssClass) {
            classes.push(item.cssClass);
        }
        classes.push(!this.multi ? this._getSelectedClassSingle(item) : this._getSelectedClassMulti(item));
        return classes.join(' ').trim();
    }
    /**
     * Return `iron-selected` CSS class if needed
     * @param item
     * @returns {string}
     * @private
     */
    _getSelectedClassSingle(item) {
        return this.selected && this.selected === item[this.optionValue] ? 'iron-selected' : '';
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
        const val = item[this.optionValue];
        if (val === null || val === undefined) {
            return -1;
        }
        return val;
    }
    _selectedValuesChanged(e) {
        if (e.detail.type === 'splice') {
            this.selectedValues = e.detail.indexSplices[0].object;
        }
        this.dispatchEvent(new CustomEvent('selected-values-changed', {
            detail: { value: this.selectedValues },
            bubbles: true,
            composed: true
        }));
    }
};
__decorate([
    property({ type: Number })
], EsmmOptionsList.prototype, "shownOptionsCount", void 0);
__decorate([
    property({ type: Boolean, attribute: 'multi', reflect: true })
], EsmmOptionsList.prototype, "multi", void 0);
__decorate([
    property({ type: String }) //  notify: true
], EsmmOptionsList.prototype, "selected", void 0);
__decorate([
    property({ type: Array }) // notify: true
], EsmmOptionsList.prototype, "selectedValues", void 0);
__decorate([
    property({ type: Array })
], EsmmOptionsList.prototype, "shownOptions", void 0);
__decorate([
    property({ type: Boolean })
], EsmmOptionsList.prototype, "showNoSearchResultsWarning", void 0);
__decorate([
    property({ type: Boolean })
], EsmmOptionsList.prototype, "showLimitWarning", void 0);
__decorate([
    property({ type: Boolean })
], EsmmOptionsList.prototype, "requestInProgress", void 0);
__decorate([
    property({ type: Boolean })
], EsmmOptionsList.prototype, "noOptionsAvailable", void 0);
__decorate([
    property({ type: Number })
], EsmmOptionsList.prototype, "shownOptionsLimit", void 0);
EsmmOptionsList = __decorate([
    customElement('esmm-options-list')
], EsmmOptionsList);
export { EsmmOptionsList };
