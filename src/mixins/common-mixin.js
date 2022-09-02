var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from 'lit-element';
import { ListItemUtils } from './list-item-utils-mixin';
/*
 * Common functionality for single selection and multiple selection dropdown
 * @polymer
 * @mixinFunction
 * @appliesMixin EtoolsLogsMixin
 * @appliesMixin EsmmMixins.ListItemUtils
 */
export function CommonFunctionality(superClass) {
    class CommonFunctionalityClass extends ListItemUtils(superClass) {
        constructor() {
            super(...arguments);
            this.alwaysFloatLabel = true;
            this.placeholder = '—';
            this.errorMessage = 'This field is required';
            this.disabled = false;
            this.readonly = false;
            this.invalid = false;
            /** Makes the dropdown to show top or bottom (or left - right) where it will fit better */
            this.noDynamicAlign = false;
            this.search = '';
            /** Array of objects, dropdowns options used to compute shownOptions */
            this.options = [];
            /** Options seen by user */
            this.searchedOptionsLength = 0;
            /**
             * Flag to show `None` option (first dropdown option)
             * Used to reset single selection dropdown selected value
             */
            this.enableNoneOption = false;
            this.hideSearch = false;
            this.hideClose = false;
            this.focusedAtLeastOnce = false;
            /** Limit displayed options */
            this.shownOptionsLimit = 30;
            /** The current number of shown options, it increseas by shownOptionsLimit when users scrolls down */
            this._shownOptionsCount = 0;
            /** Margin added if dropdown bottom is too close to the viewport bottom margin */
            this.viewportEdgeMargin = 20;
            /** Vertical offset for dropdownMenu */
            this.verticalOffset = 0;
            /**
             * By default the search string is reset when the dropdown closes
             * This flag allows the search value to persist after the dropdown is closed
             */
            this.preserveSearchOnClose = false;
            /** Flag to trigger `etools-selected-items-changed` event */
            this.triggerValueChangeEvent = false;
            this.elemAttached = false;
            this.autoWidth = false;
            this.maxWidth = '';
            this.minWidth = '';
            this.horizontalAlign = 'right';
            /* withBackdrop property was added in order to trap the focus within the light DOM of the iron-dropdown.
              Setting this to true solves a bug in PRP where when you have the etools-dropdown in a paper-dialog,
              and you click on the opened drodpdown's scroll,  the dropdown closes.
          **/
            this.withBackdrop = false;
            // below properties are used only if loadDataMethod is set
            this.page = 1;
            this.prevPage = 1;
            this.searchChanged = false;
            this.pageChanged = false;
            this.requestInProgress = false;
        }
        // @ts-ignore
        connectedCallback() {
            super.connectedCallback();
            this._shownOptionsCount = this.shownOptionsLimit;
            this.disableOnFocusHandling = this.disableOnFocusHandling || this.isIEBrowser();
            // focusout is used because blur acts weirdly on IE
            this._onFocusOut = this._onFocusOut.bind(this);
            this.addEventListener('focusout', this._onFocusOut);
        }
        // @ts-ignore
        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener('focusout', this._onFocusOut);
        }
        firstUpdated() {
            this.updateComplete.then(() => {
                this._setPositionTarget();
                this._setDropdownWidth();
                this._disableScrollAction();
                this.notifyDropdownResize();
                this._setResetSizeHandler();
                this.elemAttached = true;
                this.setFitInto();
            });
        }
        updated(changedProperties) {
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
        }
        _onFocusOut(e) {
            e.stopImmediatePropagation();
            this._closeMenu(e);
        }
        _disableScrollAction() {
            const ironDropdown = this._getIronDropdown();
            ironDropdown.scrollAction = null;
        }
        _getDialogContent(d) {
            const drContent = d.shadowRoot.querySelector('#dialogContent');
            if (drContent) {
                return drContent;
            }
            else {
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
                ironDropdown.fitInto = window.EtoolsEsmmFitIntoEl;
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
                        }
                        else {
                            // case 2: rootNodeHost is not etools-dialog, but it might contain it
                            const d = rootNodeHost.shadowRoot.querySelector('etools-dialog');
                            if (d instanceof Element) {
                                // etools-dialog found
                                dialogContent = this._getDialogContent(d);
                            }
                            else {
                                // etools-dialog not found, repeat
                                rootNodeHost = rootNodeHost.getRootNode().host;
                            }
                        }
                    }
                    calculatedFitInto = dialogContent;
                }
                catch (e) {
                    console.log('Cannot find etools-dialog content element.');
                    calculatedFitInto = null;
                }
            }
            if (calculatedFitInto && calculatedFitInto instanceof Element) {
                calculatedFitInto.style.position = 'relative';
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
            this.invalid = false;
        }
        get noOptionsAvailable() {
            if (this._isUndefined(this.options)) {
                return;
            }
            return !Array.isArray(this.options) || !this.options.length;
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
                // this.updateStyles(); // TODO
            }
        }
        get shownOptions() {
            var _a;
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
            }
            else if (this.options.length > this._shownOptionsCount || this.showLimitWarning) {
                shownOptions = this._trimByShownOptionsCount(this.options);
            }
            if (this.enableNoneOption) {
                const emptyOption = { cssClass: 'esmm-none-option' };
                emptyOption[this.optionValue] = null;
                emptyOption[this.optionLabel] = this.noneOptionLabel;
                shownOptions.unshift(emptyOption);
            }
            const shownOptionsNo = shownOptions ? shownOptions.length : 0;
            if (initialOptionsNo !== shownOptionsNo) {
                (_a = this._getIronDropdown()) === null || _a === void 0 ? void 0 : _a._updateOverlayPosition();
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
                }
                else if (this.pageChanged) {
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
            this.searchedOptionsLength = options.length;
            return options.slice(0, Math.min(this._shownOptionsCount || 0, options.length));
        }
        _itemContainsSearchString(item) {
            return (item[this.optionLabel] &&
                item[this.optionLabel].toString().toLowerCase().indexOf(this.search.toLowerCase()) > -1);
        }
        /** Flag to show the limit of options shown in dropdown */
        get showLimitWarning() {
            if (this._isUndefined(this._shownOptionsCount) || this._isUndefined(this.searchedOptionsLength) || this.requestInProgress) {
                return false;
            }
            return this.searchedOptionsLength > this._shownOptionsCount;
        }
        _computeEqualToShownOptionsLimit(shownOptionsLimit) {
            return shownOptionsLimit;
        }
        /** Flag used to show no search result found warning */
        get showNoSearchResultsWarning() {
            if (this.noOptionsAvailable) {
                return false;
            }
            return ((this.options.length > 0 && this.shownOptions.length === 0) ||
                (this.shownOptions.length === 1 && this.shownOptions[0][this.optionValue] === null));
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
            }
            else {
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
                var _a, _b, _c, _d, _f, _g, _h;
                let focusTarget = null;
                if (!this.shownOptions || !this.shownOptions.length) {
                    focusTarget = (_c = (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#optionsList')) === null || _b === void 0 ? void 0 : _b.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelector('#noOptions');
                }
                else {
                    if (this.hideSearch) {
                        focusTarget = (_g = (_f = (_d = this.shadowRoot) === null || _d === void 0 ? void 0 : _d.querySelector('#optionsList')) === null || _f === void 0 ? void 0 : _f.shadowRoot) === null || _g === void 0 ? void 0 : _g.querySelector('paper-icon-item');
                    }
                    else {
                        focusTarget = (_h = this._getSearchox().shadowRoot) === null || _h === void 0 ? void 0 : _h.querySelector('#searchInput');
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
            var _a;
            return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#dropdownMenu");
        }
        _getIronDropdownContent() {
            var _a;
            return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#ironDrContent");
        }
        _getOptionsList() {
            var _a;
            return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#optionsList");
        }
        _getSearchox() {
            var _a;
            return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#searchbox");
        }
        _getPaperInputContainer() {
            var _a, _b, _c, _d;
            if (this.tagName === 'ETOOLS-DROPDOWN') {
                return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#main");
            }
            return (_d = (_c = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("#main")) === null || _c === void 0 ? void 0 : _c.shadowRoot) === null || _d === void 0 ? void 0 : _d.querySelector("#container");
        }
        _openMenu(_e) {
            const dr = this._getIronDropdown();
            if (!dr.opened) {
                this._setDropdownMenuVerticalOffset();
                dr.open();
            }
        }
        _closeMenu(_e) {
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
            var _a;
            const paperListBox = (_a = this._getOptionsList().shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('paper-listbox');
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
    }
    __decorate([
        property({ type: String, attribute: 'label' })
    ], CommonFunctionalityClass.prototype, "label", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'no-label-float' })
    ], CommonFunctionalityClass.prototype, "noLabelFloat", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'always-float-label' })
    ], CommonFunctionalityClass.prototype, "alwaysFloatLabel", void 0);
    __decorate([
        property({ type: String, attribute: 'placeholder' })
    ], CommonFunctionalityClass.prototype, "placeholder", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'required', reflect: true })
    ], CommonFunctionalityClass.prototype, "required", void 0);
    __decorate([
        property({ type: String, attribute: 'error-message' })
    ], CommonFunctionalityClass.prototype, "errorMessage", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'auto-validate' })
    ], CommonFunctionalityClass.prototype, "autoValidate", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'disabled', reflect: true })
    ], CommonFunctionalityClass.prototype, "disabled", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'readonly', reflect: true })
    ], CommonFunctionalityClass.prototype, "readonly", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'invalid', reflect: true })
    ], CommonFunctionalityClass.prototype, "invalid", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'no-dynamic-align' })
    ], CommonFunctionalityClass.prototype, "noDynamicAlign", void 0);
    __decorate([
        property({ type: String, attribute: 'search' })
    ], CommonFunctionalityClass.prototype, "search", void 0);
    __decorate([
        property({ type: Array })
    ], CommonFunctionalityClass.prototype, "options", void 0);
    __decorate([
        property({ type: Number })
    ], CommonFunctionalityClass.prototype, "searchedOptionsLength", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'enable-none-option' })
    ], CommonFunctionalityClass.prototype, "enableNoneOption", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'hide-search', reflect: true })
    ], CommonFunctionalityClass.prototype, "hideSearch", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'hide-close', reflect: true })
    ], CommonFunctionalityClass.prototype, "hideClose", void 0);
    __decorate([
        property({ type: Boolean })
    ], CommonFunctionalityClass.prototype, "focusedAtLeastOnce", void 0);
    __decorate([
        property({ type: Number })
        /** Limit displayed options */
    ], CommonFunctionalityClass.prototype, "shownOptionsLimit", void 0);
    __decorate([
        property({ type: Number })
    ], CommonFunctionalityClass.prototype, "_shownOptionsCount", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'disable-on-focus-handling', reflect: true }) // value: 
    ], CommonFunctionalityClass.prototype, "disableOnFocusHandling", void 0);
    __decorate([
        property({ type: Object }) // observer: 'setFitInto'
    ], CommonFunctionalityClass.prototype, "fitInto", void 0);
    __decorate([
        property({ type: Number, attribute: 'viewport-edge-margin' })
    ], CommonFunctionalityClass.prototype, "viewportEdgeMargin", void 0);
    __decorate([
        property({ type: Number, attribute: 'vertical-offset' })
    ], CommonFunctionalityClass.prototype, "verticalOffset", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'preserve-search-on-close' })
    ], CommonFunctionalityClass.prototype, "preserveSearchOnClose", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'trigger-value-change-event' })
    ], CommonFunctionalityClass.prototype, "triggerValueChangeEvent", void 0);
    __decorate([
        property({ type: Boolean })
    ], CommonFunctionalityClass.prototype, "elemAttached", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'auto-width' })
    ], CommonFunctionalityClass.prototype, "autoWidth", void 0);
    __decorate([
        property({ type: String, attribute: 'max-width' })
    ], CommonFunctionalityClass.prototype, "maxWidth", void 0);
    __decorate([
        property({ type: String, attribute: 'min-width' })
    ], CommonFunctionalityClass.prototype, "minWidth", void 0);
    __decorate([
        property({ type: String, attribute: 'horizontal-align' })
    ], CommonFunctionalityClass.prototype, "horizontalAlign", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'with-backdrop', reflect: true })
    ], CommonFunctionalityClass.prototype, "withBackdrop", void 0);
    __decorate([
        property({ type: String, attribute: 'load-data-method' })
    ], CommonFunctionalityClass.prototype, "loadDataMethod", void 0);
    __decorate([
        property({ type: Number })
    ], CommonFunctionalityClass.prototype, "page", void 0);
    __decorate([
        property({ type: Number })
    ], CommonFunctionalityClass.prototype, "prevPage", void 0);
    __decorate([
        property({ type: String })
    ], CommonFunctionalityClass.prototype, "prevSearch", void 0);
    __decorate([
        property({ type: Boolean })
    ], CommonFunctionalityClass.prototype, "searchChanged", void 0);
    __decorate([
        property({ type: Boolean })
    ], CommonFunctionalityClass.prototype, "pageChanged", void 0);
    __decorate([
        property({ type: Boolean })
    ], CommonFunctionalityClass.prototype, "requestInProgress", void 0);
    return CommonFunctionalityClass;
}
