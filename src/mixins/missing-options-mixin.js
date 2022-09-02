var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { property } from 'lit-element';
import { CommonFunctionalityMixin } from './common-mixin';
/*
 * Missing options helper
 * @polymer
 * @mixinFunction
 * @appliesMixin EtoolsLogsMixin
 */
export const MissingOptionsMixin = dedupeMixin((superClass) => {
    class MissingOptionsClass extends CommonFunctionalityMixin(superClass) {
        constructor() {
            super(...arguments);
            this.url = '';
        }
        /**
         * If there are no selected options that are not found in dropdown options then request them from server using
         * url and ajaxParams(values property will contain missing values)
         * ajaxParams = {
         *    values: 1 // single value
         * }
         *
         * ajaxParams = {
         *    values: 1,2,3,4 // multiple values
         * }
         *
         * @param {Array} notFoundValues
         */
        requestMissingOptions(notFoundValues) {
            var _a;
            if (!(notFoundValues instanceof Array && notFoundValues.length)) {
                return;
            }
            if (!this.shouldRequestMissingOption(this.url)) {
                return;
            }
            const etoolsAjax = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#missingOptionsAjax');
            if (!etoolsAjax) {
                return;
            }
            etoolsAjax.url = null;
            const notFoundV = notFoundValues.join(',');
            if (this.ajaxParams && typeof this.ajaxParams === 'object') {
                this.ajaxParams.values = notFoundV;
            }
            else {
                this.ajaxParams = {
                    values: notFoundV
                };
            }
            if (typeof this.ajaxParams.values === 'string' && this.ajaxParams.values !== '') {
                etoolsAjax.url = this.url;
            }
        }
        /**
         * Handle missing option request response
         * @param response
         */
        handleMissingOptionsReqResponse(response) {
            if (!(response.detail instanceof Array && response.detail.length)) {
                return;
            }
            try {
                if (this.isValidOption(response.detail[0])) {
                    // assuming all objects from response array have same properties
                    // we just need to make sure the first one is valid, no need to use a loop here
                    const responseOptions = this.prepareReceivedOptions(response.detail);
                    this.options = [...this.options, ...responseOptions];
                    console.log('Valid missing options received etools-esmm ' + this.label);
                }
                else {
                    console.log('Missing options received(from ' +
                        this.url +
                        ') are not valid(missing ' +
                        this.optionValue +
                        'and ' +
                        this.optionLabel +
                        ' properties etools-esmm ' +
                        this.label);
                }
            }
            catch (error) {
                console.log('Error occurred on missing options request response handling etools-esmm ' + this.label, error);
            }
        }
        /**
         * Handle missing options request error
         * @param errorResponse
         */
        handleMissingOptionsReqError(errorResponse) {
            console.log('Missing options request failed! etools-esmm ' + this.label, errorResponse);
        }
        /**
         * Check if request missing option functionality can be used
         * @param url
         * @returns {boolean}
         */
        shouldRequestMissingOption(url) {
            if (typeof url === 'string' && url !== '') {
                return true;
            }
            return false;
        }
        /**
         * Check if option received from missing options request is valid
         * @param optionObj
         * @returns {boolean|*}
         */
        isValidOption(optionObj) {
            return optionObj.constructor === Object && optionObj[this.optionValue] && optionObj[this.optionLabel];
        }
        /**
         * Prepare new received options to add them to the current options list
         * @param receivedOptions
         * @returns {*}
         */
        prepareReceivedOptions(receivedOptions) {
            if (this.options instanceof Array && this.options.length > 0) {
                const missingOptions = [];
                const receivedOptionsValues = receivedOptions.map((receivedOption) => {
                    return receivedOption[this.optionValue];
                });
                receivedOptionsValues.forEach((optVal) => {
                    const option = this.options.find((option) => {
                        return option[this.optionValue] === optVal;
                    });
                    if (!option) {
                        // this option is not in the options array
                        missingOptions.push(receivedOptions.find((receivedOption) => {
                            return receivedOption[this.optionValue] === optVal;
                        }));
                    }
                });
                return missingOptions;
            }
            else {
                return receivedOptions;
            }
        }
    }
    __decorate([
        property({ type: String, attribute: 'url' })
    ], MissingOptionsClass.prototype, "url", void 0);
    __decorate([
        property({ type: Object, attribute: 'ajax-params' })
    ], MissingOptionsClass.prototype, "ajaxParams", void 0);
    return MissingOptionsClass;
});
