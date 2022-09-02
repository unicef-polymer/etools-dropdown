import { LitElement } from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
/**
 * @customElement
 * @polymer
 */
export declare class EsmmSearchboxInput extends LitElement {
    search: string;
    language: string;
    render(): import("lit-element").TemplateResult;
    _valueChanged(e: CustomEvent): void;
    getTranslation(key: string): any;
}
