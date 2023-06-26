import {SlAutocomplete} from './src/SlAutocomplete.d';

export {SlAutocomplete as EtoolsDropdownEl};

declare global {
  interface HTMLElementTagNameMap {
    'etools-dropdown': SlAutocomplete;
  }
}
