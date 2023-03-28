import path from 'node:path';
import * as m from './memoize';
import * as fc from './foreign-content';
export const foreignContentMssFactory = ({ fsssFactory, isForeignContentAvailable, expireDurationMS, fileSuffix, mssStatsInstances = new Map(), }) => {
    const mssStatsFactory = (key) => {
        let msssInstance = mssStatsInstances.get(key);
        if (!msssInstance) {
            msssInstance = { key, gets: 0, sets: 0, reject: [] };
            mssStatsInstances.set(key, msssInstance);
        }
        return msssInstance;
    };
    // Rationale: <valid-url-path-chars> minus <invalid-file-system-chars>
    // [1] valid url path chars: https://tools.ietf.org/html/rfc3986
    // [2] invalid file system chars: https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
    const invalidChars = /[^a-zA-Z0-9\-._~!$&'()+,;=@]/g;
    // provide a fileName supplier for a given key
    const mssFileNameSupplier = (key) => (_value) => path.join(process.cwd(), 'src', 'cache', 'memoized-foreign-content', key.replace(invalidChars, '-').replaceAll(/\-+/g, '-')) + fileSuffix;
    const instances = new Map();
    return (key) => {
        let instance = instances.get(key);
        if (!instance) {
            const fsMSS = fsssFactory({
                fileNameSupplier: mssFileNameSupplier(key),
                acceptPersistedFile: (stats, fn) => {
                    const accept = () => {
                        // if we're running in dev mode, always read from fs cache
                        if (import.meta.env.DEV)
                            return true;
                        if (isForeignContentAvailable()) {
                            // if we're running "production" (or "build") mode, only read from cache if not more than a few minutes old
                            const ageInMS = Date.now() - stats.mtime.valueOf();
                            if (ageInMS > expireDurationMS)
                                return new Error('time expired');
                            return true;
                        }
                        else {
                            // if there's no API token available, we always accept the cache
                            return true;
                        }
                    };
                    const result = accept();
                    if (typeof result !== 'boolean' || !result) {
                        mssStatsFactory(fn).reject.push(result);
                    }
                    return result;
                },
            });
            // wrap the instance in an instrumentation layer so we can capture stats
            instance = {
                get: (key) => {
                    mssStatsFactory(key).gets++;
                    return fsMSS.get(key);
                },
                set: (key, value) => {
                    mssStatsFactory(key).sets++;
                    return fsMSS.set(key, value);
                },
                toKey: fsMSS.toKey,
            };
        }
        return instance;
    };
};
export const foreignQueryableHtmlMemoizer = (fqhmOptions) => {
    const instances = new Map();
    // the Promise type of the return should match Mozilla Readability result
    return (url, args) => {
        var _a;
        const key = (_a = args === null || args === void 0 ? void 0 : args.key) !== null && _a !== void 0 ? _a : url;
        const extractHTML = args === null || args === void 0 ? void 0 : args.extractHTML;
        let instance = instances.get(key);
        if (!instance) {
            instance = m.memoize(async () => {
                const dom = await ((args === null || args === void 0 ? void 0 : args.sanitized)
                    ? fc.queryableSanitizedContent(url)
                    : fc.queryableContent(url));
                return extractHTML ? extractHTML(dom) : dom.serialize();
            }, foreignContentMssFactory({
                fsssFactory: m.fsTextMemoizeStoreStrategy,
                expireDurationMS: 1000 * 60 * 60 * 12,
                fileSuffix: '.memoized.html',
                ...fqhmOptions,
            })(key));
            instances.set(key, instance);
        }
        return instance;
    };
};
export const foreignReadableHtmlMemoizer = (options) => {
    const instances = new Map();
    // the Promise type of the return should match Mozilla Readability result
    return (url, key = url) => {
        let instance = instances.get(key);
        if (!instance) {
            instance = m.memoize(async () => await fc.readableContent(url), foreignContentMssFactory({
                fsssFactory: m.fsJsonMemoizeStoreStrategy,
                expireDurationMS: 1000 * 60 * 60 * 12,
                fileSuffix: '.readability.memoized.json',
                ...options,
            })(key));
            instances.set(key, instance);
        }
        return instance;
    };
};
// this is the "typical" ready-to-use memoizer and can be called like this:
// const myMFH = memoizableForeignHTML('https://mysite/page');            // the "memoizable" function
// const myHTML = await myMFH();                                          // the actual result
// const myHTML2 = await memoizableForeignHTML('https://mysite/page')();  // result all-in-one call
export const memoizableForeignHTML = foreignQueryableHtmlMemoizer({
    isForeignContentAvailable: () => true,
});
// this is the "typical" ready-to-use memoizer and can be called like this:
// const myMFR = foreignReadableHtmlMemoizer('https://mysite/page');                // the "memoizable" function
// const myReadable = await myMFR();                                                // the actual result
// const myReadable2 = await foreignReadableHtmlMemoizer('https://mysite/page')();  // result all-in-one call
export const memoizableForeignReadable = foreignReadableHtmlMemoizer({
    isForeignContentAvailable: () => true,
});
export async function memoizableForeignContent(foreignContent) {
    var _a, _b;
    if (!foreignContent.content || foreignContent.content.readable) {
        return ((_b = (_a = (await memoizableForeignReadable(foreignContent.url)())) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : `memoizableForeignContent:readable-failed`);
    }
    const fcc = foreignContent === null || foreignContent === void 0 ? void 0 : foreignContent.content;
    const sanitized = (fcc === null || fcc === void 0 ? void 0 : fcc.unsanitized) ? false : true;
    if (fcc.selectFirst || fcc.selectAll) {
        return await memoizableForeignHTML(foreignContent.url, {
            sanitized,
            extractHTML: dom => {
                var _a, _b;
                if (fcc.selectFirst) {
                    const first = dom.window.document.querySelector(fcc.selectFirst);
                    return first
                        ? first.outerHTML
                        : (_a = fcc.onSelectFail) !== null && _a !== void 0 ? _a : 'memoizableForeignContent:selectFirst-failed';
                }
                if (fcc.selectAll) {
                    let text = '';
                    const all = dom.window.document.querySelectorAll(fcc.selectAll);
                    for (const elem of all) {
                        text += elem.outerHTML;
                    }
                    return text.length > 0
                        ? text
                        : (_b = fcc.onSelectFail) !== null && _b !== void 0 ? _b : 'memoizableForeignContent:selectAll-failed';
                }
                return 'memoizableForeignContent:extractHTML-failed';
            },
        })();
    }
    else {
        return await memoizableForeignHTML(foreignContent.url, { sanitized })();
    }
}
//# sourceMappingURL=memoize-foreign-content.js.map