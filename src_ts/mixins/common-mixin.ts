import {property, LitElement} from 'lit-element';
import {IronDropdownElement} from '@polymer/iron-dropdown';
import {ListItemUtilsMixin} from './list-item-utils-mixin';
import {MixinTarget} from '../utils/types';
/*
 * Common functionality for single selection and multiple selection dropdown
 * @polymer
 * @mixinFunction
 * @appliesMixin EtoolsLogsMixin
 * @appliesMixin EsmmMixins.ListItemUtils
 */

export function CommonFunctionalityMixin<T extends MixinTarget<LitElement>>(superClass: T) {
  class CommonFunctionalityClass extends ListItemUtilsMixin(superClass) {
    /** Dropdown label */
    @property({type: String, attribute: 'label'})
    label: string | undefined;

    @property({type: Boolean, attribute: 'no-label-float'})
    noLabelFloat: boolean | undefined;

    @property({type: Boolean, attribute: 'always-float-label'})
    alwaysFloatLabel = true;

    @property({type: String, attribute: 'placeholder'})
    placeholder = '—';

    @property({type: Boolean, attribute: 'required', reflect: true})
    required: boolean | undefined;

    @property({type: String, attribute: 'error-message'})
    errorMessage = 'This field is required';

    @property({type: Boolean, attribute: 'auto-validate'})
    autoValidate: boolean | undefined;

    @property({type: Boolean, attribute: 'disabled', reflect: true})
    disabled = false;

    @property({type: Boolean, attribute: 'readonly', reflect: true})
    readonly = false;

    @property({type: Boolean, attribute: 'invalid', reflect: true})
    invalid = false;

    /** Makes the dropdown to show top or bottom (or left - right) where it will fit better */
    @property({type: Boolean, attribute: 'no-dynamic-align'})
    noDynamicAlign = false;

    @property({type: String, attribute: 'search'})
    search = '';

    /** Array of objects, dropdowns options used to compute shownOptions */
    @property({type: Array})
    options: any[] = [];

    /** Options seen by user */
    @property({type: Number})
    searchedOptionsLength = 0;

    /**
     * Flag to show `None` option (first dropdown option)
     * Used to reset single selection dropdown selected value
     */
    @property({type: Boolean, attribute: 'enable-none-option'})
    enableNoneOption = false;

    @property({type: Boolean, attribute: 'hide-search', reflect: true})
    hideSearch = false;

    @property({type: Boolean, attribute: 'hide-close', reflect: true})
    hideClose = false;

    @property({type: Boolean})
    focusedAtLeastOnce = false;

    @property({type: Number})
    /** Limit displayed options */
    shownOptionsLimit = 30;

    /** The current number of shown options, it increseas by shownOptionsLimit when users scrolls down */
    @property({type: Number})
    _shownOptionsCount = 0;

    /** Stop autofocus from paper-dialog */
    @property({type: Boolean, attribute: 'disable-on-focus-handling', reflect: true}) // value:
    disableOnFocusHandling: boolean | undefined;
    /**
     * Element that will prevent dropdown to overflow outside it's margins
     * @type HTMLElement
     */
    @property({type: Object}) // observer: 'setFitInto'
    fitInto: any;

    /** Margin added if dropdown bottom is too close to the viewport bottom margin */
    @property({type: Number, attribute: 'viewport-edge-margin'})
    viewportEdgeMargin = 20;

    /** Vertical offset for dropdownMenu */
    @property({type: Number, attribute: 'vertical-offset'})
    verticalOffset = 0;
    /**
     * By default the search string is reset when the dropdown closes
     * This flag allows the search value to persist after the dropdown is closed
     */
    @property({type: Boolean, attribute: 'preserve-search-on-close'})
    preserveSearchOnClose = false;
    /** Flag to trigger `etools-selected-items-changed` event */
    @property({type: Boolean, attribute: 'trigger-value-change-event'})
    triggerValueChangeEvent = false;
    @property({type: Boolean})
    elemAttached = false;
    @property({type: Boolean, attribute: 'auto-width'})
    autoWidth = false;
    @property({type: String, attribute: 'max-width'})
    maxWidth = '';
    @property({type: String, attribute: 'min-width'})
    minWidth = '';
    @property({type: String, attribute: 'horizontal-align'})
    horizontalAlign = 'right';
    /* withBackdrop property was added in order to trap the focus within the light DOM of the iron-dropdown.
      Setting this to true solves a bug in PRP where when you have the etools-dropdown in a paper-dialog,
      and you click on the opened drodpdown's scroll,  the dropdown closes.
  **/
    @property({type: Boolean, attribute: 'with-backdrop', reflect: true})
    withBackdrop = false;
    // Function, if defined will be called to set options dynamically (ex: after making calls on the BE)
    @property({type: String, attribute: 'load-data-method'})
    loadDataMethod: string | undefined;
    // below properties are used only if loadDataMethod is set
    @property({type: Number})
    page = 1;

    @property({type: Number})
    prevPage = 1;

    @property({type: String})
    prevSearch: string | undefined;

    @property({type: Boolean})
    searchChanged = false;

    @property({type: Boolean})
    pageChanged = false;

    @property({type: Boolean})
    requestInProgress = false;

    constructor(...args: any[]) {
      super(args);
      if (!this.language) {
        this.language = window.localStorage.defaultLanguage || 'en';
      }
      this._handleLanguageChange = this._handleLanguageChange.bind(this);
    }

    // @ts-ignore
    connectedCallback() {
      super.connectedCallback();
      this._shownOptionsCount = this.shownOptionsLimit;
      this.disableOnFocusHandling = this.disableOnFocusHandling || this.isIEBrowser();
      document.addEventListener('language-changed', this._handleLanguageChange as any);
      // focusout is used because blur acts weirdly on IE
      this._onFocusOut = this._onFocusOut.bind(this);
      this.addEventListener('focusout', this._onFocusOut);
    }

    // @ts-ignore
    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener('focusout', this._onFocusOut);
      document.removeEventListener('language-changed', this._handleLanguageChange as any);
    }

    firstUpdated() {
      this.updateComplete.then(() => {
        this._setFocusTarget();
        this._setPositionTarget();
        this._setDropdownWidth();
        this._disableScrollAction();
        this.notifyDropdownResize();

        this._setResetSizeHandler();
        this.elemAttached = true;
        this.setFitInto();
      });
    }

    updated(changedProperties: any) {
      if (changedProperties.has('required')) {
        this._requiredChanged(this.required, changedProperties.get('required'));
      }
      if (changedProperties.has('readonly')) {
        this._readonlyChanged(this.readonly, changedProperties.get('readonly'));
      }
      if (changedProperties.has('shownOptions')) {
        this._setFocusTarget();
      }
      if (changedProperties.has('fitInto')) {
        this.setFitInto();
      }
      if (changedProperties.has('verticalOffset')) {
        this.setMarginTopFromVerticalOffset();
      }
    }

    setMarginTopFromVerticalOffset(){
      if(this._getIronDropdown()){
        this._getIronDropdown().style.marginTop = `${this.verticalOffset || 0}px`;
      }
    }

    _handleLanguageChange(e: CustomEvent) {
      this.language = e.detail.language;
    }

    _onFocusOut(e: FocusEvent) {
      e.stopImmediatePropagation();
      this._closeMenu(e);
    }
    _disableScrollAction() {
      const ironDropdown = this._getIronDropdown();
      ironDropdown.scrollAction = null;
    }
    _getDialogContent(d: any) {
      const drContent = d.shadowRoot.querySelector('#dialogContent');
      if (drContent) {
        return drContent;
      } else {
        throw new Error('Element with id="dialogContent" not found in etools-dialog');
      }
    }

    debounce(fn: any, time: any) {
      let timeout: any;
      return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), time);
      };
    }

    _setFitInto() {
      const ironDropdown = this._getIronDropdown();
      // fitInto element will not let the dropdown to overlap it's margins
      if (!this.fitInto && (window as any).EtoolsEsmmFitIntoEl) {
        ironDropdown.fitInto = (window as any).EtoolsEsmmFitIntoEl;
      }
      let calculatedFitInto: any = null;
      if (this.fitInto === 'etools-dialog') {
        try {
          let rootNodeHost = (this.getRootNode() as any).host;
          let dialogContent = null;
          while (dialogContent === null && rootNodeHost) {
            const hostTagName = rootNodeHost.tagName.toLowerCase();
            // case 1: rootNodeHost is etools-dialog (unlikely, but...)
            if (hostTagName === 'etools-dialog') {
              dialogContent = this._getDialogContent(rootNodeHost);
            } else {
              // case 2: rootNodeHost is not etools-dialog, but it might contain it
              const d = rootNodeHost.shadowRoot.querySelector('etools-dialog');
              if (d instanceof Element) {
                // etools-dialog found
                dialogContent = this._getDialogContent(d);
              } else {
                // etools-dialog not found, repeat
                rootNodeHost = rootNodeHost.getRootNode().host;
              }
            }
          }
          calculatedFitInto = dialogContent;
        } catch (e) {
          console.log('Cannot find etools-dialog content element.');
          calculatedFitInto = null;
        }
      }
      if (calculatedFitInto && calculatedFitInto instanceof Element) {
        (calculatedFitInto as any).style.position = 'relative';
        ironDropdown.fitInto = calculatedFitInto;
      }
    }
    setFitInto() {
      this.debounce(this._setFitInto.bind(this), 500)();
    }

    /**
     * Reset dropdown size on close
     */
    _setResetSizeHandler() {
      const ironDropdown = this._getIronDropdown();
      ironDropdown.addEventListener('iron-overlay-closed', this.resetIronDropdownSize.bind(this));
    }

    _isUndefined(prop: any) {
      return typeof prop === 'undefined';
    }

    /**
     * Reset previous calculated maxHeight,
     * in this way on each dropdown open action we'll get the same calculated new height.
     */
    resetIronDropdownSize() {
      const ironDrContent = this._getIronDropdownContent();
      const optionsList = this._getOptionsList();
      ironDrContent.style.maxHeight = 'none';
      optionsList.style.maxHeight = 'none';
    }

    _noOptions() {
      return !this.options || !this.options.length;
    }

    _menuBtnIsDisabled(disabled: boolean, readonly: boolean) {
      return disabled || readonly;
    }

    resetInvalidState() {
      this.invalid = false;
    }

    get noOptionsAvailable() {
      if (this._isUndefined(this.options)) {
        return;
      }
      return !Array.isArray(this.options) || !this.options.length;
    }

    _readonlyChanged(newValue: any, oldValue: any) {
      if (this._isUndefined(newValue)) {
        return;
      }
      if (newValue) {
        this.invalid = false;
      }
      this._attributeRepaintNeeded(newValue, oldValue);
    }

    _requiredChanged(newValue: any, oldValue: any) {
      if (this._isUndefined(newValue)) {
        return;
      }
      if (!newValue) {
        this.invalid = false;
      }
      this._attributeRepaintNeeded(newValue, oldValue);
    }

    /**
     * Force styles update
     */
    _attributeRepaintNeeded(newValue: any, oldValue: any) {
      if (newValue !== undefined && newValue !== oldValue) {
        // this.updateStyles(); // TODO
      }
    }

    get shownOptions() {
      if (typeof this.loadDataMethod === 'function') {
        return this._loadOptionsData(this.options, this.search, this._shownOptionsCount, this.loadDataMethod);
      }

      if (this._isUndefined(this.options) || this._isUndefined(this.enableNoneOption)) {
        return;
      }

      let shownOptions = JSON.parse(JSON.stringify(this.options));
      const initialOptionsNo = shownOptions ? shownOptions.length : 0;

      if (this.search) {
        shownOptions = this.options.filter(this._itemContainsSearchString.bind(this));
        shownOptions = this._trimByShownOptionsCount(shownOptions);
      } else if (this.options.length > this._shownOptionsCount || this.showLimitWarning) {
        shownOptions = this._trimByShownOptionsCount(this.options);
      }

      if (this.enableNoneOption) {
        const emptyOption: any = {cssClass: 'esmm-none-option'};
        emptyOption[this.optionValue] = null;
        emptyOption[this.optionLabel] = this.noneOptionLabel;
        shownOptions.unshift(emptyOption);
      }
      const shownOptionsNo = shownOptions ? shownOptions.length : 0;

      if (initialOptionsNo !== shownOptionsNo) {
        this._getIronDropdown()?._updateOverlayPosition();
      }
      return shownOptions;
    }

    _loadOptionsData(options: any[], search: string, shownOptionsCount: number, loadDataMethod: any): any {
      if (search != this.prevSearch && this._shownOptionsCount !== this.shownOptionsLimit) {
        // if search changed reset _shownOptionsCount in order to load  the first page for the new search
        this._shownOptionsCount = this.shownOptionsLimit;
        return;
      }
      this.page = shownOptionsCount / this.shownOptionsLimit || 1;
      if (search != this.prevSearch || this.page !== this.prevPage) {
        this.requestInProgress = true;
        this.searchChanged = this.prevSearch !== search;
        this.pageChanged = this.page !== this.prevPage;
        this.prevSearch = search;
        this.prevPage = this.page;

        loadDataMethod(this.search, this.page, this.shownOptionsLimit + 1);

        if (this.searchChanged) {
          // eslint-disable-next-line max-len
          // if search is changed we return nothing as options to be shown, options (if any) will be set in loadDataMethod
          return;
        }
      }
      if (!this._isUndefined(options)) {
        if (this.searchChanged) {
          this.searchChanged = false;
          this.requestInProgress = false;
          // eslint-disable-next-line max-len
          // if search was changed need to update dropdown layout (options length can be different than what we had before)
          setTimeout(() => {
            this.notifyDropdownResize();
          }, 200);
        } else if (this.pageChanged) {
          this.pageChanged = false;
          this.requestInProgress = false;
          // if page was changed, options were added to the list, need to scroll up to show them
          setTimeout(() => {
            this._getIronDropdown()._updateOverlayPosition();
          }, 200);
        }
        return this._trimByShownOptionsCount(options);
      }
    }

    _trimByShownOptionsCount(options: any[]) {
      this.searchedOptionsLength = options.length;
      return options.slice(0, Math.min(this._shownOptionsCount || 0, options.length));
    }

    _itemContainsSearchString(item: any) {
      return (
        item[this.optionLabel] &&
        item[this.optionLabel].toString().toLowerCase().indexOf(this.search.toLowerCase()) > -1
      );
    }

    /** Flag to show the limit of options shown in dropdown */
    get showLimitWarning() {
      if (
        this._isUndefined(this._shownOptionsCount) ||
        this._isUndefined(this.searchedOptionsLength) ||
        this.requestInProgress
      ) {
        return false;
      }
      return this.searchedOptionsLength > this._shownOptionsCount;
    }

    _computeEqualToShownOptionsLimit(shownOptionsLimit: any) {
      return shownOptionsLimit;
    }

    /** Flag used to show no search result found warning */
    get showNoSearchResultsWarning() {
      if (this.noOptionsAvailable) {
        return false;
      }
      return (
        (this.options && this.options.length > 0 && this.shownOptions && this.shownOptions.length === 0) ||
        (this.shownOptions && this.shownOptions.length === 1 && this.shownOptions[0][this.optionValue] === null)
      );
    }

    _onDropdownOpen() {
      setTimeout(() => {
        // delay on open size updates (fixes open flickering in dialogs)
        if (!this.autoWidth) {
          this._setDropdownWidth();
        }
        // when inside a paper-dialog the dropdown opens somewhere in the background and
        // we need to force repositioning
        this.notifyDropdownResize();
      }, 0);
    }

    _onDropdownClose() {
      if (!this.preserveSearchOnClose) {
        this.search = '';
      }
    }

    _setDropdownWidth() {
      const ironDropdown = this._getIronDropdown();
      ironDropdown.style.left = this.offsetLeft + 'px'; // TODO: why is style.left set here?
      if (!this.autoWidth) {
        ironDropdown.style.width = this.offsetWidth + 'px';
      }

      if (this.minWidth && this.minWidth !== '') {
        ironDropdown.style.minWidth = this.minWidth;
      }

      if (this.maxWidth && this.maxWidth !== '') {
        ironDropdown.style.maxWidth = this.maxWidth;
      } else {
        ironDropdown.style.maxWidth = '100%';
      }
    }

    /**
     * Set focus target after showOptions is set,
     * and after the paper-icon-items have gotten the chance to be added to the DOM,
     * but before the dropdown is openned , otherwise ironDropdown will ignore focusTarget
     *
     * Setting the focus on a paper-listbox item
     * enables the 'Go to item that starts with pressed letter' functionality
     */
    _setFocusTarget() {
      setTimeout(() => {
        let focusTarget = null;
        if (!this.shownOptions || !this.shownOptions.length) {
          focusTarget = this.shadowRoot?.querySelector('#optionsList')?.shadowRoot?.querySelector('#noOptions');
        } else {
          if (this.hideSearch) {
            focusTarget = this.shadowRoot?.querySelector('#optionsList')?.shadowRoot?.querySelector('paper-icon-item');
          } else {
            focusTarget = this._getSearchbox().shadowRoot?.querySelector('#searchInput');
          }
        }

        this._getIronDropdown().focusTarget = focusTarget;
      }, 10);
    }

    _setPositionTarget() {
      // set position target to align dropdown content properly
      const ironDropdown = this._getIronDropdown();
      ironDropdown.positionTarget = this._getPaperInputContainer();
    }

    _getIronDropdown() {
      return this.shadowRoot?.querySelector('#dropdownMenu')! as any as IronDropdownElement;
    }

    _getIronDropdownContent() {
      return this.shadowRoot?.querySelector('#ironDrContent')! as any;
    }

    _getOptionsList() {
      return this.shadowRoot?.querySelector('#optionsList')! as any;
    }

    _getSearchbox() {
      return this.shadowRoot?.querySelector('#searchbox')! as any;
    }

    _getPaperInputContainer() {
      if (this.tagName === 'ETOOLS-DROPDOWN') {
        return this.shadowRoot?.querySelector('#main')! as any;
      }
      return this.shadowRoot?.querySelector('#main')?.shadowRoot?.querySelector('#container')! as any;
    }

    _openMenu(_e: Event) {
      const dr = this._getIronDropdown();
      if (!dr.opened) {
        this._setDropdownMenuVerticalOffset();
        dr.open();
      }
    }

    _closeMenu(_e: Event) {
      const dr = this._getIronDropdown();
      dr.close();
    }

    _setDropdownMenuVerticalOffset() {
      // substract 8px which represents paper-input-container top-bottom padding
      const verticalOffset = this._getPaperInputContainer().getBoundingClientRect().height - 8;
      if (verticalOffset !== this.verticalOffset) {
        this._preserveListScrollPosition();
        this.verticalOffset = verticalOffset;
      }
    }

    // if dropdown is in dialog and user scroll down to select an item, after selection the option list will be
    // scrolled up, this method will preserve option list scroll position after selection
    _preserveListScrollPosition() {
      const paperListBox = this._getOptionsList().shadowRoot?.querySelector('paper-listbox');
      const scrollTop = paperListBox?.scrollTop || 0;
      if (scrollTop > 0) {
        setTimeout(() => {
          paperListBox.scrollTop = scrollTop;
        }, 50);
      }
    }

    /**
     * On focus received from a previous element (filds navigation in form using Tab)
     * @param e
     */
    onInputFocus(e: Event) {
      if (this.disableOnFocusHandling) {
        return;
      }
      this.focusedAtLeastOnce = true;
      this._openMenu(e);
    }

    notifyDropdownResize() {
      const ironDropdown = this._getIronDropdown();
      ironDropdown.notifyResize();
    }

    /**
     * Checks for IE11 browser :)
     * @returns {boolean}
     */
    isIEBrowser() {
      const userAgent = window.navigator.userAgent;
      return userAgent.indexOf('Trident/') > -1;
    }

    arrayIsNotEmpty(arr: string | any[]) {
      return Array.isArray(arr) && arr.length;
    }

    // prevents the element from rendering an error message container when valid
    _getErrorMessage(message: any, invalid: any) {
      return invalid ? message : '';
    }

    onShowMore(e: CustomEvent) {
      this._shownOptionsCount = e.detail;
    }
  }

  return CommonFunctionalityClass;
}
