var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { property } from 'lit-element';
import { getTranslation } from '../utils/translate';
/*
 * Item data utils mixin
 * @polymer
 * @mixinFunction
 */
export const ListItemUtils = dedupeMixin((superClass) => {
    class ListItemUtilsClass extends superClass {
        constructor() {
            super(...arguments);
            /** Option object property to use as value for selection */
            this.optionValue = 'value';
            /** Option object property to use as label */
            this.optionLabel = 'label';
            /** Show option label on 2 lines */
            this.twoLinesLabel = false;
            /** None option label */
            this.noneOptionLabel = '-- NONE --';
            /** Capitalize selected values/option, UI only */
            this.capitalize = false;
            this.language = 'en';
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
        _capitalizeString(string) {
            return string
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                .join(' ');
        }
        getTranslation(key) {
            return getTranslation(this.language, key);
        }
    }
    __decorate([
        property({ type: String, attribute: 'option-value' })
    ], ListItemUtilsClass.prototype, "optionValue", void 0);
    __decorate([
        property({ type: String, attribute: 'option-label' })
    ], ListItemUtilsClass.prototype, "optionLabel", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'two-lines-label', reflect: true })
    ], ListItemUtilsClass.prototype, "twoLinesLabel", void 0);
    __decorate([
        property({ type: String, attribute: 'none-option-label' })
    ], ListItemUtilsClass.prototype, "noneOptionLabel", void 0);
    __decorate([
        property({ type: Boolean, attribute: 'capitalize' })
    ], ListItemUtilsClass.prototype, "capitalize", void 0);
    __decorate([
        property({ type: String, attribute: 'language' })
    ], ListItemUtilsClass.prototype, "language", void 0);
    return ListItemUtilsClass;
});
