import {LitElement, PropertyValues, html, property} from 'lit-element';
import {CommonFunctionalityMixin} from './mixins/common-mixin.js';
import {MissingOptionsMixin} from './mixins/missing-options-mixin.js';
import './SlAutocomplete.js';
import SlAutocomplete from './SlAutocomplete.js';

/**
 * `etools-dropdown`
 *
 * @customElement
 * @polymer
 * @appliesMixin DropdownRequiredMixins
 * @demo demo/index.html
 */
export class EtoolsDropdown extends CommonFunctionalityMixin(MissingOptionsMixin(LitElement)) {
  /** Dropdown selected value `optionValue` prop of the selected option */
  @property({type: Number}) // observer: '_selectedChanged', notify: true
  selected: any;

  /** Selected option object */
  @property({type: Object}) // notify: true
  selectedItem: any = null;

  /** Selected value not found in options */
  @property({type: Number})
  notFoundOption: number | null = null;

  /** Element title attribute */
  @property({type: String, attribute: 'title', reflect: true}) // computed: 'getLabel(selectedItem)'
  title = '';

  /* withBackdrop property was added in order to trap the focus within the light DOM of the iron-dropdown.
           Setting this to true solves a bug in PRP where when you have the etools-dropdown in a paper-dialog,
           and you click on the opened drodpdown's scroll,  the dropdown closes.
        **/
  @property({type: Boolean, attribute: 'with-backdrop', reflect: true})
  withBackdrop = false;

  @property({type: String})
  language!: string;

  // private _debouncer: Debouncer | null = null;

  @property({type: String})
  _inputId: any;
  @property({type: String})
  maxlength: any;
  @property({type: String})
  allowedPattern: any;
  @property({type: String})
  _ariaLabelledBy: any;
  @property({type: String})
  _ariaDescribedBy: any;
  @property({type: String})
  type: any;
  @property({type: String})
  pattern: any;
  @property({type: String})
  autocomplete: any;
  @property({type: String})
  inputmode: any;
  @property({type: String})
  minlength: any;
  @property({type: String})
  min: any;
  @property({type: String})
  max: any;
  @property({type: String})
  step: any;
  @property({type: String})
  name: any;
  @property({type: String})
  list: any;
  @property({type: String})
  size: any;
  @property({type: String})
  autocorrect: any;

  @property({type: String})
  autosave: any;
  @property({type: String})
  results: any;
  @property({type: String})
  accept: any;
  @property({type: String})
  multiple: any;
  @property({type: String})
  inputRole: any;
  @property({type: String})
  inputAriaHaspopup: any;

  render() {
    // language=HTML
    return html`
      <sl-autocomplete
        .items="${this.options}"
        .selectedItems="${[this.selectedItem]}"
        .selectedValues="${[this.selected]}"
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
    if (changedProperties.has('options') || changedProperties.has('selected')) {
      this.selectedItem = this.options?.find((o: any) => String(o[this.optionValue]) == String(this.selected));
    }
  }

  // This will not be required when we drop this ts files
  _searchChanged({detail}: CustomEvent) {
    this.search = detail.value;
  }

  _selectionChanged({detail}: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('etools-selected-item-changed', {
        detail: {selectedItem: detail?.value},
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
