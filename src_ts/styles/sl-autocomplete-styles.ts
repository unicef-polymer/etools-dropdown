import {css} from 'lit';
// @ts-ignore
import shoelaceStyles from '@shoelace-style/shoelace/dist/themes/light.styles.js';

export default css`
  ${shoelaceStyles}

  :host {
    box-sizing: border-box;
    display: block;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  :host-context([multiple]) sl-tag::part(base) {
    height: auto;
    white-space: normal;
    line-height: 1.8;
  }

  [hidden] {
    display: none !important;
  }

  :host([invalid]) {
    --sl-input-label-color: red;
  }

  .form-control .invalid-message {
    color: var(--sl-input-label-color);
  }

  .form-control.form-control--small .invalid-message {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control.form-control--medium .invalid-message {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control.form-control--large .invalid-message {
    font-size: var(--sl-input-label-font-size-large);
  }

  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }

  /** The popup */
  .select {
    flex: 1 1 auto;
    display: inline-flex;
    width: 100%;
    position: relative;
    vertical-align: middle;
  }

  .select::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .select[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .select[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  /* Combobox */
  .select__combobox {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    color: var(--sl-input-color);
    cursor: pointer;
    transition: var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  .select__display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    color: var(--sl-input-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
  }

  .select:not(.select--disabled):hover .select__display-input {
    color: var(--sl-input-color-hover);
  }

  .select__display-input:focus {
    outline: none;
  }

  /* Visually hide the display input when multiple is enabled */
  .select--multiple:not(.select--placeholder-visible) .select__display-input {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .select__value-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: -1;
  }

  .select__tags {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    margin-inline-start: var(--sl-spacing-2x-small);
  }

  .select__tags sl-tag {
    cursor: pointer !important;
  }

  .select--disabled .select__tags,
  .select--disabled .select__tags sl-tag {
    cursor: not-allowed !important;
  }

  .select--readonly .select__tags {
    cursor: default !important;
    margin: 0;
  }
  .select--readonly .select__tags sl-tag {
    cursor: text !important;
  }

  /* Standard selects */
  .select--standard .select__combobox {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .select--standard.select--disabled .select__combobox {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    color: var(--sl-input-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
    outline: none;
  }

  .select--standard.select--readonly .select__combobox {
    background-color: none;
    border: 0;
    padding: 0;
    outline: none;
  }

  .select--standard:not(.select--disabled):not(.select--readonly).select--open .select__combobox,
  .select--standard:not(.select--disabled):not(.select--readonly).select--focused .select__combobox {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .select--standard.select--transparent .select__combobox {
    background: none;
    border: 0;
  }

  .select--standard:not(.select--disabled):not(.select--readonly).select--transparent.select--open .select__combobox,
  .select--standard:not(.select--disabled):not(.select--readonly).select--transparent.select--focused
    .select__combobox {
    background: none;
    border: 0;
    box-shadow: none;
  }

  .select--standard.select--invalid .select__combobox {
    color: red;
    border-color: red;
  }

  /* Filled selects */
  .select--filled .select__combobox {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .select--filled:hover:not(.select--disabled) .select__combobox {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .select--filled.select--disabled .select__combobox {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select--filled:not(.select--disabled).select--open .select__combobox,
  .select--filled:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
  }

  /* Sizes */
  .select--small .select__combobox {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    min-height: var(--sl-input-height-small);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-small);
  }

  .select--small .select__clear {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .select--small .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .select--small.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-block: 2px;
    padding-inline-start: 0;
  }

  .select--small .select__tags {
    gap: 2px;
  }

  .select--medium .select__combobox {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    min-height: var(--sl-input-height-medium);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-medium);
  }

  .select--medium .select__clear {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .select--medium .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .select--medium.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 3px;
  }

  .select--medium .select__tags {
    gap: 3px;
  }

  .select--large .select__combobox {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    min-height: var(--sl-input-height-large);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-large);
  }

  .select--large .select__clear {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .select--large .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  .select--large.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 4px;
  }

  .select--large .select__tags {
    gap: 4px;
  }

  /* Pills */
  .select--pill.select--small .select__combobox {
    border-radius: var(--sl-input-height-small);
  }

  .select--pill.select--medium .select__combobox {
    border-radius: var(--sl-input-height-medium);
  }

  .select--pill.select--large .select__combobox {
    border-radius: var(--sl-input-height-large);
  }

  /* Prefix */
  .select__prefix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--sl-input-placeholder-color);
  }

  /* Clear button */
  .select__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .select__clear:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .select__clear:focus {
    outline: none;
  }

  /* Expand icon */
  .select__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--sl-spacing-small);
  }

  .select--open .select__expand-icon {
    rotate: -180deg;
  }

  .select--readonly .select__expand-icon {
    display: none;
  }

  /* Listbox */
  .dropdown {
    display: flex;
    flex-direction: column;
    position: relative;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    background: var(--sl-panel-background-color);
    border-radius: var(--sl-border-radius-medium);
    padding-inline: 0;
    padding-block: 0;

    /* Make sure it adheres to the popup's auto size */
    max-width: var(--auto-size-available-width);
    max-height: var(--auto-size-available-height);
  }

  .dropdown .list {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    /* Minimum height at leat one item*/
    min-height: 37px;
  }

  .dropdown .footer {
    border-top: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    text-align: right;
    padding: 5px;
  }

  .dropdown::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }

  .dropdown::slotted(small) {
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-500);
    padding-block: var(--sl-spacing-x-small);
    padding-inline: var(--sl-spacing-x-large);
  }

  .search {
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    background: rgb(255, 255, 255);
    padding: 10px;
  }

  .select--standard sl-menu-item::part(checked-icon) {
    visibility: hidden;
    width: 10px;
  }

  .select--standard:not(.select--multiple) sl-menu-item[checked]::part(base) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .select--multiple sl-menu-item::part(checked-icon) {
    border: 2px solid black;
    visibility: visible;
    border-radius: 4px;
    padding: 0px;
    height: 20px;
    width: 20px;
    margin: 0 8px;
    align-self: center;
  }

  .select--multiple sl-menu-item[checked]::part(checked-icon) {
    color: black;
  }

  .select--multiple sl-menu-item:not([checked])::part(checked-icon) {
    color: transparent;
  }

  sl-menu {
    border: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
  }

  .loading-text::part(label) {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .loading-text::part(base),
  .no-options-available-text::part(base),
  .no-results-text::part(base) {
    opacity: 1;
    cursor: default;
    background-color: var(--sl-input-background-color-disabled);
  }

  .infinite-scroll-trigger {
    width: 100%;
    height: 1px;
    display: block;
  }

  :host([capitalize]) .select__tags sl-tag,
  :host([capitalize]) sl-menu-item::part(label) {
    text-transform: capitalize;
  }
`;
