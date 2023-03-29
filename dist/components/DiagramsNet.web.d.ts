export default class DiagramsNetViewerComponent extends HTMLElement {
    static diagnoseAttrName: string;
    static drawIoSrcUrlAttrName: string;
    static diagramTitleAttrName: string;
    static widthAttrName: string;
    static heightAttrName: string;
    static get observedAttributes(): string[];
    diagramsViewerBaseURL: string;
    drawIoSrcUrl: string;
    diagramTitle: string;
    diagnose: string | boolean;
    width: string;
    height: string;
    shadow: ShadowRoot;
    connectedCallback(): void;
}
