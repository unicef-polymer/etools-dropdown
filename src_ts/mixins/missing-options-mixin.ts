import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { LitElement, property } from 'lit-element';
import { MixinTarget } from '../utils/types';
import { CommonFunctionality } from './common-mixin';

/*
 * Missing options helper
 * @polymer
 * @mixinFunction
 * @appliesMixin EtoolsLogsMixin
 */

export const MissingOptions = dedupeMixin(
  <T extends MixinTarget<LitElement>> (superClass: T) =>
    {
    class MissingOptionsClass extends CommonFunctionality(superClass) {
      @property({type: String, attribute: 'url'})
      url: string = '';

      @property({type: Object, attribute: 'ajax-params'})
      ajaxParams: any;

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
      requestMissingOptions(notFoundValues: any[]) {
        if (!(notFoundValues instanceof Array && notFoundValues.length)) {
          return;
        }
        if (!this.shouldRequestMissingOption(this.url)) {
          return;
        }
        const etoolsAjax = this.shadowRoot?.querySelector("#missingOptionsAjax") as any;
        if (!etoolsAjax) {
          return;
        }
        etoolsAjax.url = null;
        const notFoundV = notFoundValues.join(',');
        if (this.ajaxParams && typeof this.ajaxParams === 'object') {
          this.ajaxParams.values = notFoundV;
        } else {
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
      handleMissingOptionsReqResponse(response: CustomEvent) {
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
          } else {
            console.log(
              'Missing options received(from ' +
                this.url +
                ') are not valid(missing ' +
                this.optionValue +
                'and ' +
                this.optionLabel +
                ' properties etools-esmm ' + this.label
            );
          }
        } catch (error) {
          console.log(
            'Error occurred on missing options request response handling etools-esmm ' + this.label, error
          );
        }
      }

      /**
       * Handle missing options request error
       * @param errorResponse
       */
      handleMissingOptionsReqError(errorResponse: CustomEvent) {
        console.log('Missing options request failed! etools-esmm ' + this.label, errorResponse);
      }

      /**
       * Check if request missing option functionality can be used
       * @param url
       * @returns {boolean}
       */
      shouldRequestMissingOption(url: string) {
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
      isValidOption(optionObj: any) {
        return optionObj.constructor === Object && optionObj[this.optionValue] && optionObj[this.optionLabel];
      }

      /**
       * Prepare new received options to add them to the current options list
       * @param receivedOptions
       * @returns {*}
       */
      prepareReceivedOptions(receivedOptions: any[]) {
        if (this.options instanceof Array && this.options.length > 0) {
          const missingOptions: any[] = [];
          const receivedOptionsValues = receivedOptions.map((receivedOption) => {
            return receivedOption[this.optionValue];
          });
          receivedOptionsValues.forEach((optVal) => {
            const option = this.options.find((option: any) => {
              return option[this.optionValue] === optVal;
            });
            if (!option) {
              // this option is not in the options array
              missingOptions.push(
                receivedOptions.find((receivedOption: any) => {
                  return receivedOption[this.optionValue] === optVal;
                })
              );
            }
          });
          return missingOptions;
        } else {
          return receivedOptions;
        }
      }
    }

    return MissingOptionsClass;
  }
);
