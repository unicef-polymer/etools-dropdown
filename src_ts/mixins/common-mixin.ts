import {property, LitElement} from 'lit-element';
import {ListItemUtilsMixin} from './list-item-utils-mixin';
import {MixinTarget} from '../utils/types';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce';
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

    _debouncerResize: Debouncer | null = null;

    @property({type: Number, attribute: 'tabindex', reflect: true})
    tabIndex = 0;

    constructor(...args: any[]) {
      super(args);
    }
  }

  return CommonFunctionalityClass;
}
