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
* noLabelFloat: Boolean, default false, if tset to true the label will not be shown when a value is selected
* optionsLabelKey: String, default 'label'
* optionsValueKey: String, default 'value'

The options objects you pass to this element could have other properties. For example:

```javascript
this.demoOptions = [
  {id: 1, country: 'US', imgClass: 'flag-icon flag-icon-us'},
  {id: 2, country: 'Canada', imgClass: 'flag-icon flag-icon-ca'},
  {id: 3, country: 'Mexico', imgClass: 'flag-icon flag-icon-mx'}
]
```
In this case you have to specify the properties that represent the value and the label. Example:
```html
<etools-dropdown label="Countries"
  options="[[demoOptions]]"
  options-label-key="country"
  options-value-key="id"
  no-label-float="true"></etools-dropdown>
```

If you have a `imgClass` property (representing icon class) in your dropdown options the icon will be shown for each
option and also the dropdown will have an icon for selected option. In this case you need to provide a `custom-style`
to this element. Since this element separate from your app you will have to dynamically add images styles.
This can be done using a behavior. Example:

```html
<!-- dynamic-custom-style-behavior.html -->
<script>
var DynamicCustomStyleBehavior = {

  addCustomStyle: function(styleModuleName, customElementRoot) {
    var newCustomStyle = document.createElement('style', 'custom-style');
    newCustomStyle.setAttribute('include', styleModuleName);
    Polymer.dom(customElementRoot).insertBefore(newCustomStyle, Polymer.dom(customElementRoot).querySelector('style'));
  }

}
</script>

<!-- some-custom-element.html -->
<link rel="import" href="../bower_components/polymer/polymer.html">
<link rel="import" href="../bower_components/etools-dropdown/etools-dropdown.html">

<link rel="import" href="behaviors/dynamic-custom-style-behavior.html">
<link rel="import" href="styles/countries-flags-styles.html">

<dom-module id="some-custom-element">
  <template>
    <etools-dropdown id="countriesDropdown"
                         label="Countries"
                         options="[[countriesData]]"
                         options-label-key="name"
                         options-value-key="id"
                         no-label-float="true"></etools-dropdown>
  </template>
  <script>
      (function() {
        'use strict';

        Polymer({

          is: 'some-custom-element',

          behaviors: [DynamicCustomStyleBehavior],

          properties: {

          },

          ready: function() {
            this.addCustomStyle('countries-flags-styles', this.$.countriesDropdown.root);
          }

        });

      })();
    </script>
</dom-module>
```

## Styling

You can use defined variables to change element style.
This options are based on paper-dropdown-menu styling.

Custom property | Description | Default
----------------|-------------|----------
`--etools-dropdown-font-size` | Input size | `14px`
`--etools-dropdown-floated-label-font-size` | Floated label font zize | `12px`
`--etools-dropdown-text-color` | Input text color | `#333333`
`--etools-dropdown-error-text-color` | Validation error message color | `#e51919`
`--etools-dropdown-disabled-color` | Disabled color | `#d1d1d1`
`--etools-dropdown-option-icon` | Mixin to style option icon | `{}`
`--etools-dropdown-icon` | Mixin to style dropdown icon | `{}`
`--etools-dropdown-with-icon-input` | Mixin to style the dropdown's input when it has icon | `{}`

## Install
```bash
$ bower install --save etools-dropdown
```

## Preview element locally
Install needed dependencies by running: `$ bower install`.
Make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `$ polymer serve` to serve your element application locally.

## Linting the code

Innstall local npm packages (run `npm install`)
Then just run the linting task

```bash
$ npm run lint
```
You should also use polylint. If you don't have Polylint installed run `npm install -g polylint`.
Then just run the linter on each file you wish to check like so

```bash
$ polylint -i filename.html
```
At the moment polylint crashes if it encounters a missing import. If that happens, temporarily comment out such imports and run the command again.

## Running Tests

```
$ polymer test
```
