/*
 * Dropdown test dummy data
 * @polymer
 * @mixinFunction
 */
export const TestData = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        simpleOptions: {
          type: Array
        },
        twoLineOptions: {
          type: Array
        }
      };
    }

    constructor() {
      super();
      this.simpleOptions = [];
      for (let i = 1; i <= 150; i++) {
        this.simpleOptions.push({value: i, label: 'option ' + i});
      }

      this.twoLineOptions = [];
      for (let i = 1; i <= 10; i++) {
        this.twoLineOptions.push({value: i, label: 'Option ' + i + '|' + 'Second line for option' + i});
      }

      this.dispatchEvent(new CustomEvent('simple-options-changed'));
      this.dispatchEvent(new CustomEvent('two-line-options-changed'));
    }
  };
