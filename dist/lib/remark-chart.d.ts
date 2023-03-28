import type { VFile } from 'vfile';
import { z } from 'zod';
export declare const chartJsSchema: z.ZodObject<{
    canvas: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }, {
        id?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }>>;
    type: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    data: Record<string, unknown>;
    type: string;
    canvas?: {
        id?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    } | undefined;
}, {
    data: Record<string, unknown>;
    type: string;
    canvas?: {
        id?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    } | undefined;
}>;
export type ChartJsPluginConfig = z.infer<typeof chartJsSchema>;
export type ChartJsPluginState = {
    index: number;
};
export type ChartJsVfileDataShape = {
    chartJsPluginState?: ChartJsPluginState;
};
export declare const apacheEChartsPluginSchema: z.ZodObject<{
    canvas: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }, {
        id?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    canvas?: {
        id?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    } | undefined;
}, {
    canvas?: {
        id?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
    } | undefined;
}>;
export type ApacheEChartsPluginConfig = z.infer<typeof apacheEChartsPluginSchema>;
export type ApacheEChartsPluginState = {
    index: number;
};
export type ApacheEChartsVfileDataShape = {
    apacheEChartsPluginState?: ApacheEChartsPluginState;
};
export declare function remarkPlugin(): (tree: any, vfile: VFile, next?: ((...args: unknown[]) => unknown) | undefined) => any;
