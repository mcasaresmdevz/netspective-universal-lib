export default class KrokiComponent extends HTMLElement {
    static hostAttrName: string;
    static diagramAttrName: string;
    static outputAttrName: string;
    static diagnoseAttrName: string;
    static get observedAttributes(): string[];
    host: string;
    diagramType: string;
    output: string;
    diagnose: string | boolean;
    connectedCallbackRender(): void;
    connectedCallback(): void;
}
