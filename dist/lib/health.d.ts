/**
 * This is old-style Typescript, TODO switch to Zod instead
 */
export interface TypeGuard<T> {
    (o: unknown): o is T;
}
export declare function typeGuard<T, K extends keyof T = keyof T>(...requireKeysInSingleT: K[]): TypeGuard<T>;
/**
 * Health Check Response Format for HTTP APIs (draft-inadarei-api-health-check-01)
 * See: https://tools.ietf.org/id/draft-inadarei-api-health-check-06.html
 */
/**
 * Status: (required) indicates whether the service status is acceptable or not. API publishers SHOULD use following values for the field:
 *   “pass”: healthy,
 *   “fail”: unhealthy, and
 *   “warn”: healthy, with some concerns.
 * The value of the status field is tightly related with the HTTP response code returned by the health endpoint. For “pass” and “warn” statuses
 * HTTP response code in the 2xx-3xx range MUST be used. For “fail” status HTTP response code in the 4xx-5xx range MUST be used. In case of the
 * “warn” status, endpoint SHOULD return HTTP status in the 2xx-3xx range and additional information SHOULD be provided, utilizing optional
 * fields of the response.
 */
export type ServiceHealthState = 'pass' | 'fail' | 'warn';
export type ServiceHealthLinks = Record<string, string>;
export type ServiceHealthAffectedEndpoints = Record<string, string>;
export interface ServiceHealthStatusable {
    status: ServiceHealthState;
}
export declare const isServiceHealthStatus: TypeGuard<ServiceHealthStatusable>;
export interface ServiceHealthDiagnosable {
    output: string;
    notes?: string[];
}
export declare const isServiceHealthDiagnosable: TypeGuard<ServiceHealthDiagnosable>;
export interface ServiceHealthVersioned {
    version: string;
    releaseId: string;
}
export declare const isServiceHealthVersioned: TypeGuard<ServiceHealthVersioned>;
export interface ServiceHealthComponents {
    checks: Record<ServiceHealthComponentName, ServiceHealthComponentChecks>;
}
export declare const isServiceHealthComponents: TypeGuard<ServiceHealthComponents>;
export interface ServiceHealthLinkable {
    links: ServiceHealthLinks;
}
export declare const isServiceHealthLinkable: TypeGuard<ServiceHealthLinkable>;
export interface ServiceHealthAffectable {
    affectedEndpoints: ServiceHealthAffectedEndpoints;
}
export declare const isServiceHealthAffectable: TypeGuard<ServiceHealthAffectable>;
export interface ServiceHealthIdentity {
    serviceId: string;
    description: string;
}
export declare const isServiceHealthIdentity: TypeGuard<ServiceHealthIdentity>;
export interface HealthyServiceStatus extends ServiceHealthStatusable, ServiceHealthVersioned, Partial<ServiceHealthLinkable>, Partial<ServiceHealthComponents>, Partial<ServiceHealthIdentity> {
    status: 'pass';
}
export interface UnhealthyServiceStatus extends ServiceHealthStatusable, ServiceHealthVersioned, ServiceHealthDiagnosable, ServiceHealthComponents, ServiceHealthIdentity, Partial<ServiceHealthLinkable>, Partial<ServiceHealthAffectable> {
    status: 'fail' | 'warn';
}
export type HealthServiceStatus = HealthyServiceStatus | UnhealthyServiceStatus;
export interface HealthServiceStatusEndpoint {
    readonly headers: Record<string, string>;
    readonly body: HealthServiceStatus;
}
export declare function isHealthy(o: unknown): o is HealthyServiceStatus;
export declare function isUnhealthy(o: unknown): o is UnhealthyServiceStatus;
export type TypicalServiceHealthMetricName = 'utilization' | 'responseTime' | 'connections' | 'uptime';
export type ServiceHealthObservedValue = string | number | Date | Record<string, unknown> | Array<unknown>;
export type ServiceHealthObservedUnit = string;
export interface ServiceHealthObservation {
    metricName: TypicalServiceHealthMetricName | string;
    observedValue: ServiceHealthObservedValue;
    observedUnit: ServiceHealthObservedUnit;
}
export type ServiceHealthComponentName = string;
export type ServiceHealthComponentType = 'component' | 'datastore' | 'system';
export interface ServiceHealthComponent {
    componentId: string;
    componentType: ServiceHealthComponentType;
}
export interface HealthyServiceHealthComponentStatus extends ServiceHealthStatusable, ServiceHealthComponent, Partial<ServiceHealthObservation>, ServiceHealthLinkable {
    time: Date;
    node?: string;
}
export interface UnhealthyServiceHealthComponentStatus extends ServiceHealthStatusable, ServiceHealthComponent, Partial<ServiceHealthObservation>, ServiceHealthDiagnosable, ServiceHealthLinkable {
    time: Date;
    node?: string;
}
export type ServiceHealthComponentStatus = HealthyServiceHealthComponentStatus | UnhealthyServiceHealthComponentStatus;
export type ServiceHealthComponentChecks = ServiceHealthComponentStatus[];
export interface ServiceHealthSupplier {
    readonly serviceHealth: ServiceHealthComponents;
}
export declare const isServiceHealthSupplier: TypeGuard<ServiceHealthSupplier>;
export declare function defaultLinks(): ServiceHealthLinks;
export declare function healthyService(report: Omit<HealthyServiceStatus, 'status'>): HealthyServiceStatus;
export declare function healthyComponent(report: Omit<HealthyServiceHealthComponentStatus, 'status'>): HealthyServiceHealthComponentStatus;
export declare function healthStatusEndpoint(report: HealthServiceStatus): HealthServiceStatusEndpoint;
export declare function unhealthyService(status: 'fail' | 'warn', report: Omit<UnhealthyServiceStatus, 'status'>): UnhealthyServiceStatus;
export declare function unhealthyComponent(status: 'fail' | 'warn', report: Omit<UnhealthyServiceHealthComponentStatus, 'status'>): UnhealthyServiceHealthComponentStatus;
