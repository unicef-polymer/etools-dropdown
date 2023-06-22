import {LitElement, PropertyValues, html, property} from 'lit-element';
// import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import {CommonFunctionalityMixin} from './mixins/common-mixin.js';
import {MissingOptionsMixin} from './mixins/missing-options-mixin.js';
// import {timeOut} from '@polymer/polymer/lib/utils/async.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';

import './SlAutocomplete.js';
import SlAutocomplete from './SlAutocomplete.js';

/**
 * `etools-dropdown-multi`
 *
 * @polymer
 * @customElement
 * @appliesMixin MultiDropdownRequiredMixins
 * @demo demo/index-multi.html
 */
export class EtoolsDropdownMulti extends CommonFunctionalityMixin(MissingOptionsMixin(LitElement)) {
  /** Dropdown selected values */
  @property({type: Array}) // notify: true
  selectedValues: any[] = [];

  /** Selected options objects */
  @property({type: Array}) // notify: true
  selectedItems: any[] = [];

  @property({type: Array})
  prevSelectedItems: any[] | undefined = undefined;

  /** Array of not found values (in options list) */
  @property({type: Array})
  notFoundOptions: any[] = [];

  /** Element title attribute */
  @property({type: String, attribute: 'title', reflect: true})
  title = '';

  @property({type: String, attribute: 'close-text', reflect: true})
  closeText!: string;

  @property({type: String})
  language!: string;

  render() {
    return html`
      <sl-autocomplete
        multiple
        clearable
        .items="${this.options}"
        .selectedItems="${this.selectedItems}"
        .selectedValues="${this.selectedValues}"
        .label="${this.label}"
        .placeholder="${this.placeholder}"
        .optionValue="${this.optionValue}"
        .optionLabel="${this.optionLabel}"
        ?required="${this.required}"
        ?readonly="${this.readonly}"
        ?disabled="${this.disabled}"
        ?invalid="${this.invalid}"
        ?capitalize="${this.capitalize}"
        .hideSearch="${this.hideSearch}"
        .loadDataMethod=${this.loadDataMethod}
        @search-changed="${this._searchChanged}"
        @selection-changed="${this._selectionChanged}"
        .errorMessage="${this.errorMessage}"
      >
      </sl-autocomplete>
    `;
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('options') || changedProperties.has('selectedValues')) {
      this.selectedItems = this.options.filter((o: any) => this.selectedValues.includes(String(o[this.optionValue])));
    }
  }

  // This will not be required when we drop this ts files
  _searchChanged({detail}: CustomEvent) {
    this.search = detail.value;
  }

  _selectionChanged({detail}: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('etools-selected-items-changed', {
        detail: {selectedItems: detail?.value},
        bubbles: true,
        composed: true
      })
    );
  }

  validate() {
    this.invalid = (this.shadowRoot?.querySelector('sl-autocomplete') as SlAutocomplete)?.validate();
    return this.invalid;
  }
}
