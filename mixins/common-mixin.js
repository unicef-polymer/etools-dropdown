import {ListItemUtils} from './list-item-utils-mixin.js';
import EtoolsLogsMixin from '@unicef-polymer/etools-behaviors/etools-logs-mixin.js';
/*
 * Common functionality for single selection and multiple selection dropdown
 * @polymer
 * @mixinFunction
 * @appliesMixin EtoolsLogsMixin
 * @appliesMixin EsmmMixins.ListItemUtils
 */
export const CommonFunctionality = superClass => class extends EtoolsLogsMixin(ListItemUtils(superClass)) {

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
        computed: '_computeShownOptions(options, search, enableNoneOption, options.length)',
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
      dropdownIsClosing: {
        type: Boolean,
        value: false
      },
      /** Limit displayed options */
      shownOptionsLimit: {
        type: Number,
        value: 30
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
        computed: '_computeShowLimitWarning(shownOptionsLimit, searchedOptionsLength)'
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
        observer: '_setFitInto'
      },
      /** Margin added if dropdown bottom is too close to the viewport bottom margin */
      viewportEdgeMargin: {
        type: Number,
        value: 20
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
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    // focusout is used because blur acts weirdly on IE
    this._onFocusOut = this._onFocusOut.bind(this);
    this.addEventListener('focusout', this._onFocusOut);

    this._setFitInto(this.fitInto);
    this._setPositionTarget();
    this._setDropdownWidth();
    this._disableScrollAction();
    this.notifyDropdownResize();

    this._setResetSizeHandler();
    this.elemAttached = true;
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
    let ironDropdown = this._getIronDropdown();
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

  _setFitInto(fitInto) {
    let ironDropdown = this._getIronDropdown();
    // fitInto element will not let the dropdown to overlap it's margins
    if (!fitInto && window.EtoolsEsmmFitIntoEl) {
      ironDropdown.set('fitInto', window.EtoolsEsmmFitIntoEl);
    }
    if (fitInto === 'etools-dialog') {
      try {
        let rootNodeHost = this.getRootNode().host;
        let dialogContent = null;
        while (dialogContent === null && rootNodeHost) {
          let hostTagName = rootNodeHost.tagName.toLowerCase();
          // case 1: rootNodeHost is etools-dialog (unlikely, but...)
          if (hostTagName === 'etools-dialog') {
            dialogContent = this._getDialogContent(rootNodeHost);
          } else {
            // case 2: rootNodeHost is not etools-dialog, but it might contain it
            let d = rootNodeHost.shadowRoot.querySelector('etools-dialog');
            if (d instanceof Element) {
              // etools-dialog found
              dialogContent = this._getDialogContent(d);
            } else {
              // etools-dialog not found, repeat
              rootNodeHost = rootNodeHost.getRootNode().host;
            }
          }
        }
        fitInto = dialogContent;
      } catch (e) {
        this.logWarn('Cannot find etools-dialog content element.', 'etools-dropdown', e);
        fitInto = null;
      }
    }
    if (fitInto && fitInto instanceof Element) {
      fitInto.style.position = 'relative';
      ironDropdown.set('fitInto', fitInto);
    }
  }

  /**
   * Reset dropdown size on close
   */
  _setResetSizeHandler() {
    let ironDropdown = this._getIronDropdown();
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
    let ironDrContent = this._getIronDropdownContent();
    let optionsList = this._getOptionsList();
    ironDrContent.style.maxHeight = 'none';
    optionsList.style.maxHeight = 'none';
  }

  _dropdownOpenedDownwards(overlayCoord) {
    let paperContainerCoords = this.$.main.getBoundingClientRect();
    return Math.abs(overlayCoord.top - paperContainerCoords.top) <= 10;
  }

  _noOptions() {
    return (!this.options || !this.options.length);
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

  _computeShownOptions(options, search, enableNoneOption) {
    if (this._isUndefined(options) || this._isUndefined(enableNoneOption)) {
      return;
    }

    let shownOptions = JSON.parse(JSON.stringify(options));

    if (search) {
      shownOptions = options.filter(this._itemContainsSearchString.bind(this));
      shownOptions = this._trimByShownOptionsLimit(shownOptions);
    } else if (options.length > this.shownOptionsLimit) {
      shownOptions = this._trimByShownOptionsLimit(options);
    }

    if (enableNoneOption) {
      let emptyOption = {cssClass: 'esmm-none-option'};
      emptyOption[this.optionValue] = null;
      emptyOption[this.optionLabel] = this.noneOptionLabel;
      shownOptions.unshift(emptyOption);
    }

    return shownOptions;
  }

  _trimByShownOptionsLimit(options) {
    this.set('searchedOptionsLength', options.length);
    return options.slice(0, Math.min(this.shownOptionsLimit, options.length));
  }

  _itemContainsSearchString(item) {
    return item[this.optionLabel] &&
      item[this.optionLabel].toString().toLowerCase().indexOf(this.search.toLowerCase()) > -1;
  }

  _computeShowLimitWarning(limit, searchedOptionsLength) {
    if (this._isUndefined(limit) || this._isUndefined(searchedOptionsLength)) {
      return false;
    }
    return searchedOptionsLength > limit;
  }

  _showNoSearchResultsWarning(noOptionsAvailable, shownOptionsLength, optionsLength) {
    if (noOptionsAvailable) {
      return false;
    }
    return (optionsLength > 0 && shownOptionsLength === 0) ||
      (shownOptionsLength === 1 && this.shownOptions[0][this.optionValue] === null);
  }

  _validCoordinates(coords) {
    return !(coords.x === 0 && coords.y === 0 &&
      coords.width === 0 && coords.height === 0 &&
      coords.left === 0 && coords.right === 0 &&
      coords.top === 0 && coords.bottom === 0);
  }

  _bottomTooCloseToViewportEdge(dropdownBottom) {
    let viewportH = this._getViewportHeight();
    return (viewportH - dropdownBottom) < 10;
  }

  _dropdownBottomOutsideViewPort(openedDropdownCoord) {
    let viewportH = this._getViewportHeight();
    let dropdownBottomY = openedDropdownCoord.top + openedDropdownCoord.height;
    let diff = viewportH - dropdownBottomY;
    return diff <= 0;
  }

  _getViewportHeight() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  }

  // TODO: this might be removed as support IE11 has ended
  _recalculateOptionsListHeightForIE11(newComputedHeight, openedDropdownCoord, drControlsHeight) {
    if (this.isIEBrowser()) {
      let viewportH = this._getViewportHeight();
      /**
       * - if newComputedHeight is bigger than IE11 viewport we need to recalculate list height
       * or
       * - recheck bottom margin if it's visible, it might still be under viewport bottom limit in IE11
       * possible dynamicAlign issue in IE11
       */
      if (this._dropdownOpenedDownwards(openedDropdownCoord) &&
        (newComputedHeight > viewportH || this._dropdownBottomOutsideViewPort(openedDropdownCoord))) {
        newComputedHeight = this._getNewHeightRelatedToBottomViewportEdge(openedDropdownCoord, drControlsHeight);
      }

      /**
       * There is another case when the top coordinate of the dropdown is negative
       * and the height is bigger than the viewport height
       */
      if (!this._dropdownOpenedDownwards(openedDropdownCoord) && newComputedHeight > viewportH) {
        let maxDropdownHeight = viewportH - openedDropdownCoord.bottom;
        newComputedHeight = viewportH - maxDropdownHeight - drControlsHeight - 60;
        let ironDropdown = this._getIronDropdown();
        ironDropdown.style.top = '60px'; // adjust iron dropdown top to be able to see it, ugly
      }
    }
    return newComputedHeight;
  }

  _getSearchFieldHeight() {
    let searchboxHeight = 0;
    if (!this.hideSearch) {
      let searchInputWrapper = this._getSearchox();
      searchboxHeight = Number(window.getComputedStyle(searchInputWrapper).height.replace('px', ''));
    }
    return searchboxHeight;
  }

  _getNewHeightRelatedToBottomViewportEdge(openedDropdownCoord, drControlsHeight) {
    let viewportH = this._getViewportHeight();
    return viewportH - openedDropdownCoord.top - drControlsHeight - this.viewportEdgeMargin;
  }

  _resizeOptionsListHeight() {
    let ironDrContent = this._getIronDropdownContent();

    let dropdownContentHeightCheck = setInterval(function () {
      // opened dropdown coordinates
      let openedDropdownCoord = ironDrContent.getBoundingClientRect();

      // don't do anything until maxHeight is set and the dropdown has been opened
      if (ironDrContent.style.maxHeight && this._validCoordinates(openedDropdownCoord)) {
        clearInterval(dropdownContentHeightCheck);
        let drMaxHeight = Number(ironDrContent.style.maxHeight.replace('px', ''));
        let searchboxHeight = this._getSearchFieldHeight();
        let dropdownControls = this.querySelector('#dropdown-controls');
        let dropdownControlsTopPadding = dropdownControls
          ? dropdownControls.style.paddingTop.replace('px', '')
          : 0;

        // for browsers
        let listOptionsComputedHeight = drMaxHeight - searchboxHeight - dropdownControlsTopPadding;
        if (this._dropdownOpenedDownwards(openedDropdownCoord) &&
          this._bottomTooCloseToViewportEdge(drMaxHeight + openedDropdownCoord.top)) {
          listOptionsComputedHeight -= this.viewportEdgeMargin;
        }

        // check if height is correctly calculated for IE11 and recalculate if needed
        listOptionsComputedHeight = this._recalculateOptionsListHeightForIE11(listOptionsComputedHeight,
          openedDropdownCoord, searchboxHeight + dropdownControlsTopPadding);

        let optionsList = this._getOptionsList();
        optionsList.style.maxHeight = listOptionsComputedHeight + 'px';
      }
    }.bind(this), 0);
  }

  _onDropdownOpen() {

    setTimeout(() => {
      // delay on open size updates (fixes open flickering in dialogs)
      if (!this.autoWidth) {
        this._setDropdownWidth();
      }
      this._resizeOptionsListHeight();
      // when inside a paper-dialog the dropdown opens somewhere in the background and
      // we need to force repositioning
      this.notifyDropdownResize();
    }, 0);
  }

  _onDropdownClose() {
    this.dropdownIsClosing = false;
    if (!this.preserveSearchOnClose) {
      this.set('search', '');
    }
  }

  _setDropdownWidth() {
    let ironDropdown = this._getIronDropdown();
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
    let ironDropdown = this._getIronDropdown();
    ironDropdown.set('positionTarget', this);
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

  _openMenu(e) {
    let dr = this._getIronDropdown();
    if (!dr.opened) {
      dr.open();
    }
  }

  _closeMenu(e) {
    let dr = this._getIronDropdown();
    this.dropdownIsClosing = true;
    dr.close();
  }

  /**
   * On focus received from a previous element (filds navigation in form using Tab)
   * @param e
   */
  onInputFocus(e) {
    if (this.disableOnFocusHandling || this.dropdownIsClosing) {
      return;
    }
    this._openMenu(e);
  }

  notifyDropdownResize() {
    let ironDropdown = this._getIronDropdown();
    ironDropdown.notifyResize();
  }

  /**
   * Checks for IE11 browser :)
   * @returns {boolean}
   */
  isIEBrowser() {
    let userAgent = window.navigator.userAgent;
    return userAgent.indexOf('Trident/') > -1;
  }

  arrayIsNotEmpty(arr) {
    return Array.isArray(arr) && arr.length;
  }

  // prevents the element from rendering an error message container when valid
  _getErrorMessage(message, invalid) {
    return invalid ? message : '';
  }
};
