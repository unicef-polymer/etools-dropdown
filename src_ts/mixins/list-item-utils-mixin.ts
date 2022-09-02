import {dedupeMixin} from '@open-wc/dedupe-mixin';
import {LitElement, property} from 'lit-element';
import {getTranslation} from '../utils/translate';
import {MixinTarget} from '../utils/types';
/*
 * Item data utils mixin
 * @polymer
 * @mixinFunction
 */

export const ListItemUtilsMixin = dedupeMixin(<T extends MixinTarget<LitElement>>(superClass: T) => {
  class ListItemUtilsClass extends superClass {
    /** Option object property to use as value for selection */
    @property({type: String, attribute: 'option-value'})
    optionValue = 'value';

    /** Option object property to use as label */
    @property({type: String, attribute: 'option-label'})
    optionLabel = 'label';
    /** Show option label on 2 lines */
    @property({type: Boolean, attribute: 'two-lines-label', reflect: true})
    twoLinesLabel = false;

    /** None option label */
    @property({type: String, attribute: 'none-option-label'})
    noneOptionLabel = '-- NONE --';

    /** Capitalize selected values/option, UI only */
    @property({type: Boolean, attribute: 'capitalize'})
    capitalize = false;

    @property({type: String, attribute: 'language'})
    language = 'en';

    /**
     * Get option primary label. All chars until `|` .
     * @param label
     * @returns {string}
     */
    getPrimaryLabel(label: string) {
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
    getSecondaryLabel(label: string) {
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
    getValue(item: any) {
      return item ? item[this.optionValue] : null;
    }

    /**
     * Get option label
     * @param item
     * @returns {*}
     */
    getLabel(item: any) {
      let label = '';
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
    _capitalizeString(string: string) {
      return string
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
    }

    getTranslation(key: string) {
      return getTranslation(this.language, key);
    }
  }

  return ListItemUtilsClass;
});
