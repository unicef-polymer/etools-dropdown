import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/*
 * Item data utils mixin
 * @polymer
 * @mixinFunction
 */
export const ListItemUtils = dedupingMixin(
    superClass => class extends superClass {

      static get properties() {
        return {
          /** Option object property to use as value for selection */
          optionValue: {
            type: String,
            value: 'value'
          },
          /** Option object property to use as label */
          optionLabel: {
            type: String,
            value: 'label'
          },
          /** Show option label on 2 lines */
          twoLinesLabel: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
          },
          /** None option label */
          noneOptionLabel: {
            type: String,
            value: '-- NONE --'
          },
          /** Capitalize selected values/option, UI only */
          capitalize: {
            type: Boolean,
            value: false
          }
        };
      }

      /**
       * Get option primary label. All chars until `|` .
       * @param label
       * @returns {string}
       */
      getPrimaryLabel(label) {
        let l = '';
        if (label) {
          l = label.slice(0, label.indexOf('|'));
          if (this.capitalize) {
            l = this._capitalizeString(l);
          }
        }
        return l;
      }

      /**
       * Get option secondary label. All chars after `|`
       * @param label
       * @returns {*}
       */
      getSecondaryLabel(label) {
        if (label === this.noneOptionLabel) {
          return 'Reset selected option';
        }
        let sl = '';
        if (label) {
          sl = label.slice(label.indexOf('|') + 1);
          if (this.capitalize) {
            sl = this._capitalizeString(sl);
          }
        }
        return sl;
      }

      /**
       * Get current option value
       * @param item
       * @returns {null}
       */
      getValue(item) {
        return item ? item[this.optionValue] : null;
      }

      /**
       * Get option label
       * @param item
       * @returns {*}
       */
      getLabel(item) {
        let label = null;
        if (item) {
          label = this.twoLinesLabel ? this.getPrimaryLabel(item[this.optionLabel]) : item[this.optionLabel];
          if (this.capitalize && !this.twoLinesLabel) {
            // capitalize label
            label = this._capitalizeString(label);
          }
        }
        return label;
      }

      /**
       * Capitalize string
       * @param string
       * @returns {string}
       */
      _capitalizeString(string) {
        return string.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      }

    });
