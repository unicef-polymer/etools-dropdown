# \<etools-dropdown\> and \<etools-dropdown-multi\>

Dropdown menu with search and single/multiple option(s) selection.
For documentation details see component demo (`npm i`, `polymer serve`)

## Usage

Examples:

Single/multi selection, with search

```html
<etools-dropdown
      label="Searchable menu"
      options="[[realOptions]]"
      selected="{{selectedId}}"></etools-dropdown>

<etools-dropdown-multi
    label="Searchable menu"
    options="[[realOptions]]"
    selected-values="{{selectedValuesArray}}"></etools-dropdown-multi>
```

Single/multi selection, without search

```html
<etools-dropdown
     label="Options menu"
     options="[[realOptions]]"
     selected="{{selectedId}}"
     hide-search></etools-dropdown>

<etools-dropdown-multi
     label="Searchable menu"
     options="[[realOptions]]"
     selected-values="{{selectedValuesArray}}"
     hide-search></etools-dropdown-multi>
```

Single selection, with search, limit of 3 elements

```html
<etools-dropdown
              label="Searchable menu"
              options="[[realOptions]]"
              shown-items-limit="3"
              selected="{{selectedId}}"></etools-dropdown>
```

Single selection, with search, always display an empty value (-- None --).
Note: `etools-dropdown-multi` cannot use `enableNoneOption`.

```html
<etools-dropdown
              label="Searchable menu"
              options="[[realOptions]]"
              enable-none-option
              selected="{{selectedId}}"></etools-dropdown>
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
    on-etools-selected-item-changed="_selectedItemChanged"></etools-dropdown>

<etools-dropdown-multi
    label="Multi searchable menu"
    options="[[realOptions]]"
    trigger-value-change-event
    on-etools-selected-items-changed="_selectedItemsChanged">
</etools-dropdown-multi>
```

Error messages and validations. You can use `invalid`, `auto-validate`, `required` to validate your selection.

```html
<etools-dropdown
        id="dropdownElement"
        label="Searchable menu with validation manually triggered (in 5s)"
        error-message="You must select an option"
        auto-validate required
        options="[[realOptions]]"
        dynamic-align></etools-dropdown>

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
]
```
```html
<etools-dropdown
        label="Searchable menu, custom objects"
        options="[[customObjOptions]]"
        option-value="option_key"
        option-label="option_label"></etools-dropdown>
```

## Styling

Use `paper-input` (and related elements) style properties and mixins.
Specific css variables and mixins of this element:

Custom property | Description | Default
----------------|-------------|----------
`--esmm-select-cursor` | CSS cursor property | `pointer`
`--esmm-icons` | Mixin applied to element icons | `{color: var(--secondary-text-color); cursor: pointer;}`
`--esmm-search-input-label` | Mixin aplied to the search input label | `{}`
`--esmm-list-item-selected-color` | Selected options bg color | `#DCDCDC`
`--esmm-multi-placeholder-color` | Multiselection dropdown placeholder color | `rgba(0, 0, 0, 0.54)`
`--esmm-bg-color` | Dropdown background color | `#ffffff`

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
