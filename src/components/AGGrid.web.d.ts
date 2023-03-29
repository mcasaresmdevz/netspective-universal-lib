import type { boolean } from "drizzle-orm/pg-core";

export interface Props {
	class?: 'ag-theme-balham';
	style?: string;
	'display-after-grid-ready'?: number;
}

export default function (props: Props): HTMLElement