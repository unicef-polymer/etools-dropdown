import EtoolsLogsMixin from 'etools-behaviors/etools-logs-mixin.js';
import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/*
 * Missing options helper
 * @polymer
 * @mixinFunction
 * @appliesMixin EtoolsLogsMixin
 */
export const MissingOptions = dedupingMixin(superClass => class extends EtoolsLogsMixin(superClass) {

  static get properties() {
    return {
      url: String,
      ajaxParams: Object
    };
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
    if (!(notFoundValues instanceof Array && notFoundValues.length)) {
      return;
    }
    if (!this.shouldRequestMissingOption(this.url)) {
      return;
    }
    let etoolsAjax = this.$.missingOptionsAjax;
    if (!etoolsAjax) {
      return;
    }
    etoolsAjax.url = null;
    let notFoundV = notFoundValues.join(',');
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
  handleMissingOptionsReqResponse(response) {
    if (!(response.detail instanceof Array && response.detail.length)) {
      return;
    }
    try {
      if (this.isValidOption(response.detail[0])) {
        // assuming all objects from response array have same properties
        // we just need to make sure the first one is valid, no need to use a loop here
        let responseOptions = this.prepareReceivedOptions(response.detail);
        this.set('options', [...this.options, ...responseOptions]);

        this.logWarn('Valid missing options received', 'etools-esmm ' + this.label, response.detail, true);
      } else {
        this.logWarn('Missing options received(from ' + this.url + ') are not valid(missing ' + this.optionValue +
            'and ' + this.optionLabel + ' properties)', 'etools-esmm ' + this.label, null, true);
      }
    } catch (error) {
      this.logError('Error occurred on missing options request response handling', 'etools-esmm ' + this.label,
          error, true);
    }
  }

  /**
   * Handle missing options request error
   * @param errorResponse
   */
  handleMissingOptionsReqError(errorResponse) {
    this.logError('Missing options request failed!', 'etools-esmm ' + this.label, errorResponse.detail, true);
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
      let missingOptions = [];
      let receivedOptionsValues = receivedOptions.map((receivedOption) => {
        return receivedOption[this.optionValue];
      });
      receivedOptionsValues.forEach((optVal) => {
        let option = this.options.find((option) => {
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
    } else {
      return receivedOptions;
    }
  }

});
