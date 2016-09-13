# \<etools-dropdown\>

Dropdown created over polymer paper-dropdown-menu element to allow the use of objects with different values and labels as options.
Example:
``` javascript
var options = [
  {value: 0, label: 'Value One'},
  {value: 1, label: 'Value Two'},
  {value: 2, label: 'Value Three'}
];
```

## Usage
```html
<etools-dropdown label="Uppercase label" options="[[demoOptions]]" dropdown-value="1" label-text-transform="uppercase" is-disabled="true"></etools-dropdown>
```

You can combine the element attributes as you need.
Available attributes:
* label: String, the element label
* labelTextTransform: String, possible values: 'uppercase' and 'capitalize'
* dropdownValue: element value, the value property of the selected option object
* isDisabled: Boolean, disabled state

## Styling

You can use defined variables to change element style.
This options are based on paper-dropdown-menu styling.

Custom property | Description | Default
----------------|-------------|----------
`--etools-dropdown-font-size` | Input size | `14px`
`--etools-dropdown-floated-label-font-size` | Floated label font zize | `12px`
`--etools-dropdown-text-color` | Input text color | `#333333`
`--etools-dropdown-error-text-color` | Validation error message color | `#e51919`

## Install
```bash
$ bower install --save etools-dropdown
```

## Preview element locally
Install needed dependencies by running: `$ bower install`.
Make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `$ polymer serve` to serve your element application locally.

## 

## Running Tests

```
$ polymer test
```
