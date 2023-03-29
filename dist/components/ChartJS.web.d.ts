export default class ChartJsComponent extends HTMLElement {
    static configHrefAttrName: string;
    static get observedAttributes(): string[];
    configHref: string | null;
    shadow: ShadowRoot;
    navigate(data: any, _options: any): void;
    connectedCallbackRender(): void;
    connectedCallback(): void;
}
