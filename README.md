# \<etools-dropdown\> and \<etools-dropdown-multi\>

Dropdown menu with search and single/multiple option(s) selection.
For documentation details see component demo (`npm i`, `polymer serve`)

### etools-dropdown specific properties

- selected: number, notify

  - the id/optionValue of the selected item

- selectedItem: Object = null, notify.

  - Selected option object

- notFoundOption: string
  - Selected value not found in options

### etools-dropdown-multi specific properties

- selectedValues - Array, notify

  - the id/optionValue of the selected items

- selectedItems: Array = [], notify

  - Selected options objects

- notFoundOptions - Array = []

  - populated in case `selectedValues` are not found in the options

- triggerValueChangeEvent - Boolean, default: `false`
  - it can be used to trigger `etools-selected-items-changed` event if needed

### Common properties

- ajaxParams: Object

  - Inherited from EsmmMixins.MissingOptions

- allowOutsideScroll: boolean

  - Inherited from EsmmMixins.CommonFunctionality
  - Allows scroll outside opened dropdown

- alwaysFloatLabel: boolean = true

  - Inherited from EsmmMixins.CommonFunctionality

- autoValidate: boolean

  - Inherited from EsmmMixins.CommonFunctionality

- capitalize: boolean = false

  - Inherited from EsmmMixins.ListItemUtils
  - Capitalize selected values/option, UI only

- disabled: boolean = false

  - Inherited from EsmmMixins.CommonFunctionality

- disableOnFocusHandling: boolean

  - Inherited from EsmmMixins.CommonFunctionality
  - Stop autofocus from paper-dialog

- noDynamicAlign: boolean = false

  - Inherited from EsmmMixins.CommonFunctionality
  - By default, dropdown is shown top or bottom where it will fit better. This flag can disable this behavior.

- enableNoneOption: boolean = false

  - Inherited from EsmmMixins.CommonFunctionality
  - Flag to show None option (first dropdown option) Used to reset single selection dropdown selected value

- errorMessage: string = "This field is required"

  - Inherited from EsmmMixins.CommonFunctionality

- fitInto: Object

  - Inherited from EsmmMixins.CommonFunctionality
  - Element that will prevent dropdown to overflow outside it's margins

- hideSearch: boolean = false

  - Inherited from EsmmMixins.CommonFunctionality

- invalid: boolean = false

  - Inherited from EsmmMixins.CommonFunctionality

- label: string

  - Inherited from EsmmMixins.CommonFunctionality
  - Dropdown label

- noLabelFloat: boolean

  - Inherited from EsmmMixins.CommonFunctionality

- noneOptionLabel: string = "-- NONE --"

  - Inherited from EsmmMixins.ListItemUtils
  - None option label

- noOptionsAvailable: boolean = truereadOnly

  - Inherited from EsmmMixins.CommonFunctionality
  - Flag to show a no options avaliable warning

- optionLabel: string = "label"

  - Inherited from EsmmMixins.ListItemUtils
  - Option object property to use as label

- options: Array

  - Inherited from EsmmMixins.CommonFunctionality
  - Array of objects, dropdowns options used to compute shownOptions

- optionValue: string = "value"

  - Inherited from EsmmMixins.ListItemUtils
  - Option object property to use as value for selection

- placeholder: string = "—"

  - Inherited from EsmmMixins.CommonFunctionality

- preserveSearchOnClose : Boolean

  - By default the search string is reset when the dropdown closes; this flag allows the search value to persist after the dropdown is closed

- readonly: boolean = false

  - Inherited from EsmmMixins.CommonFunctionality

- required: boolean

  - Inherited from EsmmMixins.CommonFunctionality

- search: string

  - Inherited from EsmmMixins.CommonFunctionality

- showLimitWarning: boolean = falsereadOnly

  - Inherited from EsmmMixins.CommonFunctionality
  - Flag to show the limit of options shown in dropdown

- shownOptions: ArrayreadOnly

  - Inherited from EsmmMixins.CommonFunctionality
  - Options seen by user

- shownOptionsLimit: number = 50

  - Inherited from EsmmMixins.CommonFunctionality
  - Limit displayed options

- showNoSearchResultsWarning: boolean = falsereadOnly

  - Inherited from EsmmMixins.CommonFunctionality
  - Flag used to show no search result found warning

- title: stringreadOnly

  - Element title attribute

- twoLinesLabel: boolean = false

  - Inherited from EsmmMixins.ListItemUtils
  - Show option label on 2 lines

- url: string

  - Inherited from EsmmMixins.MissingOptions

- viewportEdgeMargin: number = 20
  - Inherited from EsmmMixins.CommonFunctionality
  - Margin added if dropdown bottom is too close to the viewport bottom margin

## Usage

Examples:

Single/multi selection, with search

```html
<etools-dropdown label="Searchable menu" options="[[realOptions]]" selected="{{selectedId}}"></etools-dropdown>

<etools-dropdown-multi
  label="Searchable menu"
  options="[[realOptions]]"
  selected-values="{{selectedValuesArray}}"
></etools-dropdown-multi>
```

Single/multi selection, without search

```html
<etools-dropdown label="Options menu" options="[[realOptions]]" selected="{{selectedId}}" hide-search></etools-dropdown>

<etools-dropdown-multi
  label="Searchable menu"
  options="[[realOptions]]"
  selected-values="{{selectedValuesArray}}"
  hide-search
></etools-dropdown-multi>
```

Single selection, with search, limit of 3 elements

```html
<etools-dropdown
  label="Searchable menu"
  options="[[realOptions]]"
  shown-items-limit="3"
  selected="{{selectedId}}"
></etools-dropdown>
```

Single selection, with search, always display an empty value (-- None --).
Note: `etools-dropdown-multi` cannot use `enableNoneOption`.

```html
<etools-dropdown
  label="Searchable menu"
  options="[[realOptions]]"
  enable-none-option
  selected="{{selectedId}}"
></etools-dropdown>
```

Change event examples:

`etools-dropdown` has `etools-selected-item-changed` event, fired if `triggerValueChangeEvent = true`,
the `event.details` will contain the `selectedItem` object

`etools-dropdown-multi` has `etools-selected-items-changed` event, fired if `triggerValueChangeEvent = true`,
the `event.details` will contain `selectedItems` array

```html
<etools-dropdown
  label="Single searchable menu"
  options="[[realOptions]]"
  trigger-value-change-event
  on-etools-selected-item-changed="_selectedItemChanged"
></etools-dropdown>

<etools-dropdown-multi
  label="Multi searchable menu"
  options="[[realOptions]]"
  trigger-value-change-event
  on-etools-selected-items-changed="_selectedItemsChanged"
>
</etools-dropdown-multi>
```

Error messages and validations. You can use `invalid`, `auto-validate`, `required` to validate your selection.

```html
<etools-dropdown
  id="dropdownElement"
  label="Searchable menu with validation manually triggered (in 5s)"
  error-message="You must select an option"
  auto-validate
  required
  options="[[realOptions]]"
  dynamic-align
></etools-dropdown>
```

Validation triggered from javascript:

```javascript
this.$.dropdownElement.validate();
```

If the options array where objects of this model: `{value: someIntegerValue, label: someLabel}`
is not what you need you can use any type of objects. You have to set some properties on the element to tell
that you have custom options and which properties to be used as values and labels.

```javascript
// options example(used in the demo), in properties object
customObjOptions = [
  {
    option_key: 'option_identifier',
    option_label: 'Option label'
  }
];
```

```html
<etools-dropdown
  label="Searchable menu, custom objects"
  options="[[customObjOptions]]"
  option-value="option_key"
  option-label="option_label"
></etools-dropdown>
```

## Styling

Use `paper-input` (and related elements) style properties and mixins.
Specific css variables and mixins of this element:

| Custom property                               | Description                               | Default                                                  |
| --------------------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `--esmm-select-cursor`                        | CSS cursor property                       | `pointer`                                                |
| `--esmm-icons`                                | Mixin applied to element icons            | `{color: var(--secondary-text-color); cursor: pointer;}` |
| `--esmm-search-input-label`                   | Mixin aplied to the search input label    | `{}`                                                     |
| `--esmm-list-item-selected-color`             | Selected options bg color                 | `#DCDCDC`                                                |
| `--esmm-multi-placeholder-color`              | Multiselection dropdown placeholder color | `rgba(0, 0, 0, 0.54)`                                    |
| `--esmm-bg-color`                             | Dropdown background color                 | `#ffffff`                                                |
| `etools-dropdown::part(esmm-label-container)` | Mixin for Dropdown label container        | `#ffffff`                                                |
| `etools-dropdown::part(esmm-label)`           | Mixin for Dropdown label                  | `#ffffff`                                                |
| `etools-dropdown::part(esmm-label-suffix)`    | Mixin for Dropdown label suffix           | `#ffffff`                                                |
| `etools-dropdown::part(esmm-dropdown-content)`| Mixin for Dropdown content                | `#ffffff`                                                |

## Dynamically loading data

When the data source of the dropdown is voluminous, you can resort to loading just the first page of the data. The rest of the data will be loaded on request - when user scrolls down or searches in the dropdown.

Requirements for this functionality:

- The endpoint used to populate the dropdown has to support pagination and search
- After the selected value/s are saved, the API has to return more that just the saved id. Has to return all the details needed to populate the dropdown with the saved selected item. This is to cover cases like:
  - the saved item is not on the first page of the data source (on page refresh for ex)
  - after search, if the saved item is not in the results from bk it has to be re-added to the dropdown options, otherwise it will dissapear as selected from UI

Implementation example:

- In your page/component define the method that will handle the dynamic retrival of dropdown data source

```javascript
  public connectedCallback() {
    super.connectedCallback();
    this.loadUsersDropdownOptions = this._loadUsersDropdownOptions.bind(this);
  }


  _loadUsersDropdownOptions(search: string, page: number, shownOptionsLimit: number) {
    const endpoint = clone(endpointsList.users);
    endpoint.url += `?page_size=${shownOptionsLimit}&page=${page}&search=${search || ''}`;
    sendRequest({
      method: 'GET',
      endpoint: {
        url: endpoint.url
      }
    }).then((resp: GenericObject) => {
      const data = page > 1 ? [...this.users, ...resp.results] : resp.results;
      this.handleUsersNoLongerAssignedToCurrentCountry( // Re-add previously selected and saved item
        data,
        this.editedItem.assigned_to ? [this.editedItem.assigned_to] : []
      );
      this.set('users', data);
    });
  }
```

- Bind it to the dropdown

```html
   <etools-dropdown
      load-data-method="[[loadUsersDropdownOptions]]"  ....
```

```html
   <etools-dropdown
      .loadDdataMethod="${this.loadUsersDropdownOptions}"  ....
```

## Install

```bash
$ npm i --save @unicef-polymer/etools-dropdown
```

## Install the Polymer-CLI

```
$ npm install
```

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Running Tests

TODO: improve and add more tests

```
$ polymer test
```

## Circle CI

Package will be automatically published after tag push. Tag name must correspond SemVer (Semantic Versioning) rules.
Examples:

| Version match      | Result   |
| ------------------ | -------- |
| `1.2.3`            | match    |
| `1.2.3-pre`        | match    |
| `1.2.3+build`      | match    |
| `1.2.3-pre+build`  | match    |
| `v1.2.3-pre+build` | match    |
| `1.2`              | no match |

You can see more details [here](https://rgxdb.com/r/40OZ1HN5)
