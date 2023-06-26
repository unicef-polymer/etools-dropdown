import {SlAutocomplete} from './src/SlAutocomplete.d';

export {SlAutocomplete as EtoolsDropdownMultiEl};

declare global {
  interface HTMLElementTagNameMap {
    'etools-dropdown-multi': SlAutocomplete;
  }
}
