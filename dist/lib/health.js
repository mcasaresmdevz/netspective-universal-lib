/**
 * This is old-style Typescript, TODO switch to Zod instead
 */
export function typeGuard(...requireKeysInSingleT // = [...keyof T] TODO: default this to all required keys
) {
    return (o) => {
        // Make sure that the object passed is a real object and has all required props
        if (o && typeof o === 'object') {
            return !requireKeysInSingleT.find(p => !(p in o));
        }
        return false;
    };
}
export const isServiceHealthStatus = typeGuard('status');
export const isServiceHealthDiagnosable = typeGuard('output');
export const isServiceHealthVersioned = typeGuard('version', 'releaseId');
export const isServiceHealthComponents = typeGuard('checks');
export const isServiceHealthLinkable = typeGuard('links');
export const isServiceHealthAffectable = typeGuard('affectedEndpoints');
export const isServiceHealthIdentity = typeGuard('serviceId', 'description');
export function isHealthy(o) {
    if (isServiceHealthStatus(o)) {
        if (o.status === 'pass')
            return true;
    }
    return false;
}
export function isUnhealthy(o) {
    if (isServiceHealthStatus(o)) {
        if (o.status !== 'pass')
            return true;
    }
    return false;
}
export const isServiceHealthSupplier = typeGuard('serviceHealth');
export function defaultLinks() {
    return {
        schema: 'https://tools.ietf.org/id/draft-inadarei-api-health-check-06.html',
    };
}
export function healthyService(report) {
    const links = defaultLinks();
    return {
        status: 'pass',
        ...report,
        links: report.links ? { ...report.links, ...links } : links,
    };
}
export function healthyComponent(report) {
    return {
        status: 'pass',
        ...report,
    };
}
export function healthStatusEndpoint(report) {
    return {
        headers: {
            'Content-Type': 'application/health+json',
            'Cache-Control': 'max-age=3600',
        },
        body: report,
    };
}
export function unhealthyService(status, report) {
    const links = defaultLinks();
    return {
        status: status,
        ...report,
        links: report.links ? { ...report.links, ...links } : links,
    };
}
export function unhealthyComponent(status, report) {
    return {
        status: status,
        ...report,
    };
}
//# sourceMappingURL=health.js.map