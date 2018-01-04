# \<etools-dropdown\> and \<etools-dropdown-multi\>

This is a new version of 
[etools-searchable-multiselection-menu](https://github.com/unicef-polymer/etools-searchable-multiselection-menu) 
built using Polymer 2. 

`etools-dropdown` dropdown menu with search and single option selection
When the `optionValue` property is `Number` (in the options array of objects), 
the type is preserved, it's not converted to string.

`etools-dropdown-multi` dropdown menu with multi selection.
Most of the functionality it's common with `etools-dropdown`.


### etools-dropdown specific properties
* selected - Number/Array - notifies - the id/optionValue of the selected item
* selectedItem - Object - the selected item from the options array
* notFoundOption - String value, populated in case `selected` is not found in the options
* showEmptyValue - Boolean, default: false

### etools-dropdown-multi specific properties

* selectedValues - Array - notifies - the id/optionValue of the selected items
* selectedItems - Array - the selected items from the options array
* notFoundOptions - Array - populated in case `selectedValues` are not found in the options
* triggerValueChangeEvent - Boolean - default: `false`, it can be used to trigger `etools-selected-items-changed` event if needed


### Common properties
* label - String
* optionLabel - String, default: 'label'
* optionValue - String, default: 'value'
* options - Array - the dataSource of the dropdown
* shownOptions - Array - the displayed options, truncated by shownOptionsLimit
* allowOutsideScroll - Boolean, default: false
* autoValidate - Boolean
* capitalizeInputShown - Boolean
* disabled - Boolean, default: false
* dynamicAlign - Boolean, default: false
* errorMessage - string
* hideSearch - Boolean, default: false
* invalid - boolean
* placeholder - string
* readonly - Boolean, default: false
* required - boolean
* search - String
* shownOptionsLimit - Number, default: 50 - Limit the number of displayed options
* url - String, the url used to request selected missing options from server(one missing option `someUrl?values=1`,
many missing options `someUrl?values=1,2,3`).
The response of the missing options request should be an array with one or more objects with the same properties dropdown options have.
* ajaxParams - Object(optional) used to set build query string for the URL of missing options request.
* twoLinesLabel - Boolean, default: false
* title - element title attribute, computed in both cases

## Usage

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
