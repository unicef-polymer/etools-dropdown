// import {styleMap} from 'lit/directives/style-map.js';
import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import styles from './styles/sl-autocomplete-styles';

import type SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import {styleMap} from 'lit/directives/style-map.js';
import {SlInput, SlInputEvent} from '@shoelace-style/shoelace';
import {classMap} from 'lit/directives/class-map.js';
import { property, query, state } from 'lit-element/lib/decorators';
/**
 * @summary Autocompletes displays suggestions as you type.
 *
 * @since unreleased
 * @status unknown
 *
 * @dependency sl-dropdown
 * @dependency sl-menu
 *
 * @slot - The content that includes an input.
 * @slot empty-text - The text or content that is displayed when there is no suggestion based on the input.
 * @slot lading-text - The text or content that is displayed when the `loading` attribute evaluates to true.
 *
 * @csspart base - The component's internal wrapper.
 * @csspart trigger - The wrapper for the trigger slot.
 * @csspart empty-text - The empty text's wrapper.
 * @csspart loading-test - The loading text's wrapper.
 *
 */
@customElement('sl-autocomplete')
export default class SlAutocomplete extends LitElement {
  static styles = styles;

  @query('sl-input') searchInput!: SlInput;

  @state() private hasFocus = false;
  @state() private loading = false;
  @state() private _open: boolean = false;
  
  private totalItemsToShow: number = 0;
  private observerInfiniteScroll: IntersectionObserver | undefined;
  private page: number = 0;
  private prevPage: number = 0;
  private prevSearch: string = '';
  private searchHasChanged: boolean = false;
  private pageHasChanged: boolean = false;
  private search: string = '';

  @property({type: String, attribute: 'label'})
  label: string | undefined;

  @property({type: String, attribute: 'placeholder'})
  placeholder = '—';

  @property({type: String, attribute: 'search-placeholder'})
  searchPlaceholder = 'Search';

  @property({type: String, attribute: 'option-value'})
  optionValue = 'value';

  @property({type: String, attribute: 'option-label'})
  optionLabel = 'label';

  @property({type: Boolean, attribute: 'required', reflect: true})
  required: boolean | undefined;

  @property({type: String, attribute: 'error-message'})
  errorMessage = 'This field is required';

  @property({type: Boolean, attribute: 'disabled', reflect: true})
  disabled = false;

  @property({type: Boolean, attribute: 'readonly', reflect: true})
  readonly = false;

  @property({type: Boolean, attribute: 'invalid', reflect: true})
  invalid = false;

  @property({type: String, reflect: true})
  emptyText: string = 'No options available';

  @property({type: String, reflect: true})
  loadingText: string = 'Loading...';

  @property({type: Number})
  items: any[] = [];

  @property({type: String, attribute: 'load-data-method'})
  loadDataMethod: string | undefined;

  @property({type: Array})
  selectedItems: any[] = [];

  @property({type: Array})
  selectedValues: string[] = [];

  @property({type: Boolean, reflect: true, attribute: 'multiple'})
  multiple = false;

  @property({type: Boolean, attribute: 'max-options-available'})
  maxOptionsVisible: number = 0;

  @property({type: Boolean, reflect: true, attribute: 'pill'})
  pill: boolean = false;

  @property({type: String, reflect: true, attribute: 'size'})
  size: string = 'medium';

  @property({type: Boolean, reflect: true, attribute: 'filled'})
  filled: boolean = false;

  @property({type: String, reflect: true, attribute: 'placement'})
  placement: string = 'bottom-start';

  @property({type: String, reflect: true, attribute: 'help-text'})
  helpText: any;

  @property({type: Boolean, reflect: true, attribute: 'clearable'})
  clearable: boolean = false;

  @property({type: Boolean, reflect: true, attribute: 'hoist'})
  hoist: boolean = false;

  @property({type: Boolean, reflect: true, attribute: 'hide-search'})
  hideSearch: boolean = false;

  @property({type: Number, attribute: 'shown-options-limit'})
  shownOptionsLimit: number =  10;

  @property({type: Boolean})
  get open() {
    return this._open;
  }
  set open(value) {
    this._open = value;

    if (this._open) {
      this.addOpenListeners();
      this._enableInfiniteScroll();
      setTimeout(() => this.searchInput.focus({preventScroll: true}), 0);
    }

    if (!this._open) {
      this.removeOpenListeners();
      this._disableInfiniteScroll();
      this.searchInput?.blur();
      this.search = '';
      this.validate();
    }
  }

  render() {
    const hasLabel = this.label ? true : false;
    const hasHelpText = this.helpText ? true : false;
    const hasClearIcon = this.clearable && !this.disabled && !this.readonly && this.selectedValueCommaList.length > 0;
    const isPlaceholderVisible = this.placeholder && this.selectedValueCommaList.length === 0;
    const items = this.filteredItems.slice(0, this.totalItemsToShow);

    return html`
      <div
        part="form-control"
        class=${classMap({
          'form-control': true,
          'form-control--small': this.size === 'small',
          'form-control--medium': this.size === 'medium',
          'form-control--large': this.size === 'large',
          'form-control--has-label': hasLabel,
          'form-control--has-help-text': hasHelpText
        })}
      >
        <label
          id="label"
          part="form-control-label"
          class="form-control__label"
          aria-hidden=${hasLabel ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <sl-popup
            class=${classMap({
              select: true,
              'select--standard': true,
              'select--filled': this.filled,
              'select--pill': this.pill,
              'select--open': this.open,
              'select--disabled': this.disabled,
              'select--readonly': this.readonly,
              'select--multiple': this.multiple,
              'select--focused': this.hasFocus,
              'select--placeholder-visible': isPlaceholderVisible,
              'select--top': this.placement === 'top',
              'select--bottom': this.placement === 'bottom',
              'select--small': this.size === 'small',
              'select--medium': this.size === 'medium',
              'select--large': this.size === 'large'
            })}
            placement=${this.placement}
            strategy=${this.hoist ? 'fixed' : 'absolute'}
            flip
            shift
            ?active="${this.open}"
            auto-size="vertical"
            auto-size-padding="10"
          >
            <div part="combobox" slot="anchor" class="select__combobox" @mousedown="${this.handleComboboxMouseDown}">
              <slot part="prefix" name="prefix" class="select__prefix"></slot>

              <input
                part="display-input"
                class="select__display-input"
                type="text"
                placeholder=${this.placeholder}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?invalid=${this.invalid}
                .value=${this.selectedLabels}
                autocomplete="off"
                spellcheck="false"
                autocapitalize="off"
                readonly
                aria-controls="listbox"
                aria-expanded=${this.open ? 'true' : 'false'}
                aria-haspopup="listbox"
                aria-labelledby="label"
                aria-disabled=${this.disabled ? 'true' : 'false'}
                aria-readonly=${this.readonly ? 'true' : 'false'}
                aria-describedby="help-text"
                role="combobox"
                tabindex="0"
              />

              ${this.multiple
                ? html`
                    <div part="tags" class="select__tags">
                      ${this.selectedItems?.map((option: any, index: number) => {
                        if (index < this.maxOptionsVisible || this.maxOptionsVisible <= 0) {
                          return html`
                            <sl-tag
                              part="tag"
                              exportparts="
                                base:tag__base,
                                content:tag__content,
                                remove-button:tag__remove-button,
                                remove-button__base:tag__remove-button__base
                              "
                              ?pill=${this.pill}
                              size=${this.size}
                              ?removable=${!this.disabled && !this.readonly}
                              @sl-remove=${() => this.handleTagRemove(option)}
                            >
                              ${option[this.optionLabel]}
                            </sl-tag>
                          `;
                        } else if (index === this.maxOptionsVisible) {
                          return html` <sl-tag size=${this.size}> +${this.selectedItems.length - index} </sl-tag> `;
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  `
                : ''}

              <input
                class="select__value-input"
                type="text"
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?invalid=${this.invalid}
                ?required=${this.required}
                .value=${this.selectedValueCommaList}
                tabindex="-1"
                aria-hidden="true"
              />

              ${hasClearIcon
                ? html`
                    <button part="clear-button" class="select__clear" type="button" tabindex="-1">
                      <slot name="clear-icon">
                        <sl-icon
                          name="x-circle-fill"
                          library="system"
                          @mousedown=${this.handleClearMouseDown}
                          @click=${this.handleClearClick}
                        ></sl-icon>
                      </slot>
                    </button>
                  `
                : ''}

              <slot name="expand-icon" part="expand-icon" class="select__expand-icon">
                <sl-icon library="system" name="chevron-down"></sl-icon>
              </slot>
            </div>

            <div class="dropdown">
              <div part="search" id="search" class="search" ?hidden="${this.hideSearch}">
                <sl-input
                    role="presentation"
                    placeholder=${this.searchPlaceholder}
                    .value="${this.search}"
                    @sl-input=${this.handleSearchChanged}
                    autocomplete="off"
                  ></sl-input>
              </div>
              <div
                class="list"
                role="list"
                aria-expanded=${this.open ? 'true' : 'false'}
                aria-multiselectable=${this.multiple ? 'true' : 'false'}
                aria-labelledby="label"
                part="list"
                class="select__list"
                tabindex="-1"
              >
                <sl-menu>
                  ${items?.map((option: any) => html `
                    <sl-menu-item
                    type="checkbox"
                    ?checked=${this.isSelected(option)}
                    value="${option[this.optionValue]}"
                    >${option[this.optionLabel]}</sl-menu-item>
                  `)}
                  <div id="infinite-scroll-trigger"></div>
                </sl-menu>
               
                <div
                  part="loading-text"
                  id="loading-text"
                  class="loading-text"
                  aria-hidden=${this.loading ? 'false' : 'true'}
                  style="${styleMap({display: this.loading ? 'block' : 'none'})}"
                >
                  <slot name="loading-text">${this.loadingText}</slot>
                </div>
                <div
                  part="empty-text"
                  id="empty-text"
                  class="empty-text"
                  aria-hidden=${!this.loading && !items?.length ? 'false' : 'true'}
                  style="${styleMap({display: !this.loading && !items?.length ? 'block' : 'none'})}"
                >
                  <slot name="empty-text">${this.emptyText}</slot>
                </div>
                <div aria-hidden="true" style=${styleMap({width: `${this.clientWidth}px`})}></div>
              </div>
              <div class="footer">
                <sl-button size="small" variant="text" @mouseup="${() => this.hide()}">Close</sl-button>
              </div>
            </div>
          </sl-popup>
        </div>
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('sl-select', ({detail: {item}}: {detail: {item: SlMenuItem}}) => {
      this.setSelectedOption(item);
    });
    this.handleDocumentMouseDown = this.handleDocumentMouseDown.bind(this);
    this.handleDocumentFocusIn = this.handleDocumentFocusIn.bind(this);
    this.totalItemsToShow = this.shownOptionsLimit;
  }

  /**
   * Register document event listeners
  */ 
  private addOpenListeners() {
    document.addEventListener('focusin', this.handleDocumentFocusIn);
    document.addEventListener('mousedown', this.handleDocumentMouseDown);
  }

  private removeOpenListeners() {
    document.removeEventListener('focusin', this.handleDocumentFocusIn);
    document.removeEventListener('mousedown', this.handleDocumentMouseDown);
  }

  /**
   * Dropdown input mosue down handler. Responsible to open the dropdown popup on input click
   */
  private handleComboboxMouseDown(event: MouseEvent) {
    const path = event.composedPath();
    const isIconButton = path.some((el) => el instanceof Element && el.tagName.toLowerCase() === 'sl-icon-button');

    if (this.disabled || this.readonly || isIconButton) {
      return;
    }
    event.preventDefault();

    this.open = !this.open;
  }

   /**
   * Document Mouse Down handler function. On document mouse down it is hiding the dropdown popup
   * @param event MouseEvent
   */
  private handleDocumentMouseDown(event: MouseEvent) {
    // Close when clicking outside of the select
    const path = event.composedPath();
    if (this && !path.includes(this)) {
      this.hide();
    }
  }

  /**
   * Document Focus In handler function. On document focus in it is hiding the dropdown popup
   * @param event MouseEvent
   */
  private handleDocumentFocusIn(event: FocusEvent) {
    const path = event.composedPath();
    if (this && !path.includes(this)) {
      this.hide();
    }
  }

   /**
   * Clear all click handler function.Will clear entire selection
   * @param event MouseEvent
   */
  private handleClearClick(event: MouseEvent) {
    event.stopPropagation();

    this.selectedItems = [];
    this.setSelectedValues();
  }

  /**
   * Clear all mouse down handler function. It is used to stop propagation to the elements
   * @param event MouseEvent
   */
  private handleClearMouseDown(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * Tag remove handler function
   * @param option - Item that need to be removed
   */
  private handleTagRemove(option?: any) {
    const itemSelectedAtIndex = this.selectedItems.findIndex(
      (x) => x?.[this.optionValue].toString() === option[this.optionValue].toString()
    );
    if (itemSelectedAtIndex >= 0) {
      this.selectedItems.splice(itemSelectedAtIndex, 1);
    }
    this.setSelectedValues();
  }

  /**
   * Search change handler function
   * @param e SlInputEvent
   */
  private handleSearchChanged(e: SlInputEvent) {
    this.search = (e.target as SlInput)?.value;
    this.totalItemsToShow = this.shownOptionsLimit;
    this._enableInfiniteScroll();
    this.dispatchEvent(
      new CustomEvent('search-changed', {
        detail: {value: this.search},
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Getter used to return selected items values as a comma separated list.
   */
  private get selectedValueCommaList() {
    return this.selectedValues?.join(',') || '';
  }

  /**
   * Getter used to return select items labels used to display in the select input display
   */
  private get selectedLabels() {
    return this.selectedItems?.map((x) => x?.[this.optionLabel]).join(',') || '';
  }

  /**
   * Getter to return the list of items to show in the dropdown.
   * It is responsible to make loadDataMethod function call if defined and 
   * to filter the items based on the search value
   */
  get filteredItems() {
    if (typeof this.loadDataMethod === 'function') {
      return this._loadItemsData(this.items, this.search, this.loadDataMethod);
    }

    if (this.search) {
      return this.items.filter(this.itemContainsSearchString.bind(this));
    }

    return this.items;
  }

  /**
   * Set selected options. Has logic to resolve multiple selections and single selection
   * @param option Option that has been selected
   */
  private setSelectedOption(option: any) {
    const selectedItem = this.items.find((x) => x[this.optionValue].toString() === option.value.toString());
    if (!this.selectedItems) {
      this.selectedItems = [];
    }

    if (!this.selectedValues) {
      this.selectedValues = [];
    }

    const itemSelectedAtIndex = this.selectedItems.findIndex(
      (x) => x?.[this.optionValue].toString() === selectedItem[this.optionValue].toString()
    );

    if (itemSelectedAtIndex >= 0) {
      if (this.multiple) {
        this.selectedItems.splice(itemSelectedAtIndex, 1);
      } else {
        this.selectedItems = [];
      }
    } else {
      if (this.multiple) {
        this.selectedItems = [...this.selectedItems, selectedItem];
      } else {
        this.selectedItems = [selectedItem];
      }
    }

    this.setSelectedValues();

    if (!this.multiple) {
      this.hide();
    }
  }

  /**
   * Set selected values using 'optionValue' from selectedItems and 
   * triggers and also selection-changed event
   */
  setSelectedValues() {
    this.selectedValues = this.selectedItems.map((x) => x?.[this.optionValue]);
    this.validate();
    this.dispatchEvent(
      new CustomEvent('selection-changed', {
        detail: {value: this.multiple ? this.selectedItems : this.selectedItems?.[0] || undefined},
        bubbles: true,
        composed: true
      })
    );
    console.log( {value: this.multiple ? this.selectedItems : this.selectedItems?.[0] || undefined});
  }

  /**
   * Hide dropdown popup
   */
  show() {
    this.open = true;
  }

  /**
   * Show dropdown popup
   */
  hide() {
    this.open = false;
  }


  /**
   * Function to check if a specific option has been selected. 
   * It is checking if it is available in selectedItems by matching 'optionValue'
   * @param option - The option to check if it has been selected
   * @returns 
   */
  isSelected(option: any) {
    return (
      this.selectedItems.findIndex((x) => x?.[this.optionValue]?.toString() === option[this.optionValue]?.toString()) > -1
    );
  }

   /**
   * Validate dropdown selection
   * @param selected
   * @returns {boolean}
   */
   validate() {
    if (!this.hasAttribute('required') || this.hasAttribute('readonly')) {
      this.invalid = false;
      return true;
    }
   
    this.invalid = !this.selectedValueCommaList.length;
    console.log(this.invalid,this.selectedValueCommaList, this.selectedItems, this.selectedValues);
    return this.invalid;
  }

  /**
   * Responsbile to call loadDataMethod function if has been provided in order to fetch data directly from server
   * and to directly filter & search via API Requests
   * @param items - List of items currently available
   * @param search - Search value
   * @param loadDataMethod  - The load data method to call
   * @returns Existing items or empty list depending on some specific cases
   */
  _loadItemsData(items: any[], search: string, loadDataMethod: any) {
    if (search != this.prevSearch && this.totalItemsToShow !== this.shownOptionsLimit) {
      // if search changed reset _shownOptionsCount in order to load  the first page for the new search
      this.totalItemsToShow = this.shownOptionsLimit;
      return [];
    }

    this.page = (this.totalItemsToShow / this.shownOptionsLimit) || 1;
    if (search != this.prevSearch || this.page !== this.prevPage) {
      this.loading = true;
    
      this.searchHasChanged = this.prevSearch !== search;
      this.pageHasChanged = this.page !== this.prevPage;
      this.prevSearch = search;
      this.prevPage = this.page;

      loadDataMethod(this.search, this.page, this.shownOptionsLimit);

      if (this.searchHasChanged) {
        // eslint-disable-next-line max-len
        // if search is changed we return nothing as options to be shown, options (if any) will be set in loadDataMethod
        return [];
      }

      if(this.pageHasChanged){
        // if page changed return current items so we don't have an empty list until request finishes
        return items;
      }
    }

    if (this.items !== undefined) {
      if (this.searchHasChanged) {
        this.searchHasChanged = false;
        this.loading = false;
      } else if ( this.pageHasChanged) {
        this.pageHasChanged = false;
        this.loading = false;
      }

      return items || [];
    }

    return [];
  }

  /**
   * Checks if an items contains a search string by first converting the 'optionLabel' and search value to lowercase
   * @param item - Item to check against
   * @returns Boolean
   */
  itemContainsSearchString(item: any) {
    return (
      item[this.optionLabel] && item[this.optionLabel].toString().toLowerCase().indexOf(this.search.toLowerCase()) > -1
    );
  }

  /**
   * Function to disable infinite scroll functionality
   */
  _disableInfiniteScroll(){
    if(this.observerInfiniteScroll){
      this.observerInfiniteScroll.disconnect();
      this.observerInfiniteScroll = undefined;
    }
  }

  /**
   * Function to enable infinite scroll functionality by adding a intersection observer.
   */
  _enableInfiniteScroll() {
    this._disableInfiniteScroll();

    var options = {
      root: this.shadowRoot?.querySelector('.listInnerWrapper'),
      treshold: 1.0
    };

    this.observerInfiniteScroll = new IntersectionObserver((entries) => {

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.showMoreOptions();
        }
      });
    }, options);
    this.observerInfiniteScroll.observe(this.shadowRoot?.querySelector('#infinite-scroll-trigger')!);
  }

  /**
   * Function to set the number of items to show in dropdown based on the shown options limit and by
   * the infinite scroll trigger. Total items to show will increase when the list reaches the end of list
   * @returns 
   */
  showMoreOptions() {
    if (!this.items || !this.items.length) {
      this.totalItemsToShow = this.shownOptionsLimit;
      return;
    }

    this.totalItemsToShow += this.shownOptionsLimit;
  }
}
