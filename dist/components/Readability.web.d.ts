export default class ReadabilityComponent extends HTMLElement {
    static originUrlAttrName: string;
    static get observedAttributes(): string[];
    connectedCallbackRender(): void;
    connectedCallback(): void;
}
