export default class TimeDurationSpanElement extends HTMLSpanElement {
    static MINUTE: number;
    static HOUR: number;
    static DAY: number;
    static WEEK: number;
    static MONTH: number;
    static YEAR: number;
    static durationNarrative: (start: any, end: any) => string;
    static get observedAttributes(): string[];
    connectedCallback(): void;
}
