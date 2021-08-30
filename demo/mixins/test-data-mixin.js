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
          type: Array,
          value: function () {
            const opt = [];
            for (let i = 1; i <= 150; i++) {
              opt.push({value: i, label: 'option ' + i});
            }
            return opt;
          },
          notify: true
        },
        twoLineOptions: {
          type: Array,
          value: function () {
            const opt = [];
            for (let i = 1; i <= 10; i++) {
              opt.push({value: i, label: 'Option ' + i + '|' + 'Second line for option' + i});
            }
            return opt;
          },
          notify: true
        }
      };
    }
  };
