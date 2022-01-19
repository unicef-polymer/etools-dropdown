import {ListItemUtils} from './list-item-utils-mixin.js';
import EtoolsLogsMixin from '@unicef-polymer/etools-behaviors/etools-logs-mixin.js';
/*
 * Common functionality for single selection and multiple selection dropdown
 * @polymer
 * @mixinFunction
 * @appliesMixin EtoolsLogsMixin
 * @appliesMixin EsmmMixins.ListItemUtils
 */
export const CommonFunctionality = (superClass) =>
  class extends EtoolsLogsMixin(ListItemUtils(superClass)) {
    static get properties() {
      return {
        /** Dropdown label */
        label: {
          type: String
        },
        noLabelFloat: Boolean,
        alwaysFloatLabel: {
          type: Boolean,
          value: true
        },
        placeholder: {
          type: String,
          value: '—'
        },
        required: {
          type: Boolean,
          observer: '_requiredChanged',
          reflectToAttribute: true
        },
        errorMessage: {
          type: String,
          value: 'This field is required'
        },
        autoValidate: {
          type: Boolean
        },
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },
        readonly: {
          type: Boolean,
          value: function () {
            return false;
          },
          reflectToAttribute: true,
          observer: '_readonlyChanged'
        },
        invalid: {
          type: Boolean,
          value: function () {
            return false;
          },
          reflectToAttribute: true
        },
        /** Makes the dropdown to show top or bottom (or left - right) where it will fit better */
        noDynamicAlign: {
          type: Boolean,
          value: false
        },
        search: {
          type: String
          // observer: '_searchValueChanged'
        },
        /** Array of objects, dropdowns options used to compute shownOptions */
        options: {
          type: Array
        },
        /** Options seen by user */
        shownOptions: {
          type: Array,
          computed:
            // eslint-disable-next-line max-len
            '_computeShownOptions(options, search, enableNoneOption, _shownOptionsCount, options.length, loadDataMethod)',
          observer: '_setFocusTarget'
        },
        searchedOptionsLength: {
          type: Number
        },
        /**
         * Flag to show `None` option (first dropdown option)
         * Used to reset single selection dropdown selected value
         */
        enableNoneOption: {
          type: Boolean,
          value: false
        },
        hideSearch: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },
        hideClose: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },
        focusedAtLeastOnce: {
          type: Boolean,
          value: false
        },
        /** Limit displayed options */
        shownOptionsLimit: {
          type: Number,
          value: 30
        },
        /** The current number of shown options, it increseas by shownOptionsLimit when users scrolls down */
        _shownOptionsCount: {
          type: Number
        },
        /** Flag to show a no options avaliable warning */
        noOptionsAvailable: {
          type: Boolean,
          value: true,
          computed: '_computeNoOptionsAvailable(options, options.length)'
        },
        /** Flag to show the limit of options shown in dropdown */
        showLimitWarning: {
          type: Boolean,
          value: false,
          computed: '_computeShowLimitWarning(_shownOptionsCount, searchedOptionsLength, requestInProgress)'
        },
        /** Flag used to show no search result found warning */
        showNoSearchResultsWarning: {
          type: Boolean,
          value: false,
          computed: '_showNoSearchResultsWarning(noOptionsAvailable, shownOptions.length, options.length)'
        },
        /** Stop autofocus from paper-dialog */
        disableOnFocusHandling: {
          type: Boolean,
          value: function () {
            return this.disableOnFocusHandling || this.isIEBrowser();
          },
          reflectToAttribute: true
        },
        /**
         * Element that will prevent dropdown to overflow outside it's margins
         * @type HTMLElement
         */
        fitInto: {
          type: Object,
          observer: 'setFitInto'
        },
        /** Margin added if dropdown bottom is too close to the viewport bottom margin */
        viewportEdgeMargin: {
          type: Number,
          value: 20
        },
        /** Vertical offset for dropdownMenu */
        verticalOffset: {
          type: Number,
          value: 0
        },
        /**
         * By default the search string is reset when the dropdown closes
         * This flag allows the search value to persist after the dropdown is closed
         */
        preserveSearchOnClose: {
          type: Boolean,
          value: false
        },
        /** Flag to trigger `etools-selected-items-changed` event */
        triggerValueChangeEvent: {
          type: Boolean,
          value: false
        },
        elemAttached: {
          type: Boolean,
          value: false
        },
        autoWidth: {
          type: Boolean,
          value: false
        },
        maxWidth: {
          type: String,
          value: ''
        },
        minWidth: {
          type: String,
          value: ''
        },
        horizontalAlign: {
          type: String,
          value: 'right'
        },
        /* withBackdrop property was added in order to trap the focus within the light DOM of the iron-dropdown.
         Setting this to true solves a bug in PRP where when you have the etools-dropdown in a paper-dialog,
         and you click on the opened drodpdown's scroll,  the dropdown closes.
      **/
        withBackdrop: {
          type: Boolean,
          reflectToAttribute: true,
          value: false
        },
        // Function, if defined will be called to set options dynamically (ex: after making calls on the BE)
        loadDataMethod: {
          type: Object
        },
        // below properties are used only if loadDataMethod is set
        page: {
          type: Number,
          value: 1
        },
        prevPage: {
          type: Number,
          value: 1
        },
        prevSearch: {
          type: String
        },
        searchChanged: {
          type: Boolean,
          value: false
        }
      };
    }

    connectedCallback() {
      super.connectedCallback();

      this._shownOptionsCount = this.shownOptionsLimit;

      // focusout is used because blur acts weirdly on IE
      this._onFocusOut = this._onFocusOut.bind(this);
      this.addEventListener('focusout', this._onFocusOut);

      this._setPositionTarget();
      this._setDropdownWidth();
      this._disableScrollAction();
      this.notifyDropdownResize();

      this._setResetSizeHandler();
      this.elemAttached = true;
      this.setFitInto();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener('focusout', this._onFocusOut);
    }

    _onFocusOut(e) {
      e.stopImmediatePropagation();
      this._closeMenu();
    }
    _disableScrollAction() {
      const ironDropdown = this._getIronDropdown();
      ironDropdown.set('scrollAction', null);
    }
    _getDialogContent(d) {
      const drContent = d.shadowRoot.querySelector('#dialogContent');
      if (drContent) {
        return drContent;
      } else {
        throw new Error('Element with id="dialogContent" not found in etools-dialog');
      }
    }

    debounce(fn, time) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), time);
      };
    }

    _setFitInto() {
      const ironDropdown = this._getIronDropdown();
      // fitInto element will not let the dropdown to overlap it's margins
      if (!this.fitInto && window.EtoolsEsmmFitIntoEl) {
        ironDropdown.set('fitInto', window.EtoolsEsmmFitIntoEl);
      }
      let calculatedFitInto = null;
      if (this.fitInto === 'etools-dialog') {
        try {
          let rootNodeHost = this.getRootNode().host;
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
          this.logWarn('Cannot find etools-dialog content element.', 'etools-dropdown', e);
          calculatedFitInto = null;
        }
      }
      if (calculatedFitInto && calculatedFitInto instanceof Element) {
        calculatedFitInto.style.position = 'relative';
        ironDropdown.set('fitInto', calculatedFitInto);
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

    _isUndefined(prop) {
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

    _menuBtnIsDisabled(disabled, readonly) {
      return disabled || readonly;
    }

    resetInvalidState() {
      this.set('invalid', false);
    }

    _computeNoOptionsAvailable(options, optionsLength) {
      if (this._isUndefined(options)) {
        return;
      }
      return !Array.isArray(options) || !optionsLength;
    }

    _readonlyChanged(newValue, oldValue) {
      if (this._isUndefined(newValue)) {
        return;
      }
      if (newValue) {
        this.invalid = false;
      }
      this._attributeRepaintNeeded(newValue, oldValue);
    }

    _requiredChanged(newValue, oldValue) {
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
    _attributeRepaintNeeded(newValue, oldValue) {
      if (newValue !== undefined && newValue !== oldValue) {
        this.updateStyles();
      }
    }

    _computeShownOptions(options, search, enableNoneOption, shownOptionsCount, _optionsCount, loadDataMethod) {
      if (typeof loadDataMethod === 'function') {
        // if loadDataMethod property is a function, use it to load options data
        // this._debouncer = Debouncer.debounce(this._debouncer, timeOut.after(500), () => {
        return this._loadOptionsData(options, search, shownOptionsCount, loadDataMethod);
        //        });
      }

      if (this._isUndefined(options) || this._isUndefined(enableNoneOption)) {
        return;
      }

      let shownOptions = JSON.parse(JSON.stringify(options));
      const initialOptionsNo = shownOptions ? shownOptions.length : 0;

      if (search) {
        shownOptions = options.filter(this._itemContainsSearchString.bind(this));
        shownOptions = this._trimByShownOptionsCount(shownOptions);
      } else if (options.length > this._shownOptionsCount || this.showLimitWarning) {
        shownOptions = this._trimByShownOptionsCount(options);
      }

      if (enableNoneOption) {
        const emptyOption = {cssClass: 'esmm-none-option'};
        emptyOption[this.optionValue] = null;
        emptyOption[this.optionLabel] = this.noneOptionLabel;
        shownOptions.unshift(emptyOption);
      }
      const shownOptionsNo = shownOptions ? shownOptions.length : 0;
      if (initialOptionsNo !== shownOptionsNo) {
        this._getIronDropdown()._updateOverlayPosition();
      }
      return shownOptions;
    }

    _loadOptionsData(options, search, shownOptionsCount, loadDataMethod) {
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

    _trimByShownOptionsCount(options) {
      this.set('searchedOptionsLength', options.length);
      return options.slice(0, Math.min(this._shownOptionsCount, options.length));
    }

    _itemContainsSearchString(item) {
      return (
        item[this.optionLabel] &&
        item[this.optionLabel].toString().toLowerCase().indexOf(this.search.toLowerCase()) > -1
      );
    }

    _computeShowLimitWarning(limit, searchedOptionsLength, requestInProgress) {
      if (this._isUndefined(limit) || this._isUndefined(searchedOptionsLength) || requestInProgress) {
        return false;
      }
      return searchedOptionsLength > limit;
    }

    _computeEqualToShownOptionsLimit(shownOptionsLimit) {
      return shownOptionsLimit;
    }

    _showNoSearchResultsWarning(noOptionsAvailable, shownOptionsLength, optionsLength) {
      if (noOptionsAvailable) {
        return false;
      }
      return (
        (optionsLength > 0 && shownOptionsLength === 0) ||
        (shownOptionsLength === 1 && this.shownOptions[0][this.optionValue] === null)
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
        this.set('search', '');
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
      if (!this.shownOptions || !this.shownOptions.length) {
        return;
      }
      setTimeout(() => {
        let focusTarget = null;
        if (this.hideSearch) {
          focusTarget = this.$.optionsList.shadowRoot.querySelector('paper-icon-item');
        } else {
          focusTarget = this._getSearchox().shadowRoot.querySelector('#searchInput');
        }

        this._getIronDropdown().focusTarget = focusTarget;
      }, 10);
    }

    _setPositionTarget() {
      // set position target to align dropdown content properly
      const ironDropdown = this._getIronDropdown();
      ironDropdown.set('positionTarget', this._getPaperInputContainer());
    }

    _getIronDropdown() {
      return this.$.dropdownMenu;
    }

    _getIronDropdownContent() {
      return this.$.ironDrContent;
    }

    _getOptionsList() {
      return this.$.optionsList;
    }

    _getSearchox() {
      return this.$.searchbox;
    }

    _getPaperInputContainer() {
      if (this.tagName === 'ETOOLS-DROPDOWN') {
        return this.$.main;
      }
      return this.$.main.$.container;
    }

    _openMenu(e) {
      const dr = this._getIronDropdown();
      if (!dr.opened) {
        this._setDropdownMenuVerticalOffset();
        dr.open();
      }
    }

    _closeMenu(e) {
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
      const paperListBox = this._getOptionsList().shadowRoot.querySelector('paper-listbox');
      const scrollTop = paperListBox.scrollTop;
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
    onInputFocus(e) {
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

    arrayIsNotEmpty(arr) {
      return Array.isArray(arr) && arr.length;
    }

    // prevents the element from rendering an error message container when valid
    _getErrorMessage(message, invalid) {
      return invalid ? message : '';
    }

    onShowMore(e) {
      this._shownOptionsCount = e.detail;
    }
  };
