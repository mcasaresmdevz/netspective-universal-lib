export default class MarkmapComponent extends HTMLElement {
    static diagnoseAttrName: string;
    static get observedAttributes(): string[];
    diagnose: string | boolean;
    shadow: ShadowRoot;
    connectedCallback(): void;
}
