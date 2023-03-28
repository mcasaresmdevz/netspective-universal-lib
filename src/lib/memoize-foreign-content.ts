import path from 'node:path';
import type { JSDOM } from 'jsdom';
import * as m from './memoize';
import * as fc from './foreign-content';

export const foreignContentMssFactory = <V>({
  fsssFactory,
  isForeignContentAvailable,
  expireDurationMS,
  fileSuffix,
  mssStatsInstances = new Map(),
}: {
  readonly fsssFactory: (
    options: m.FileSysMemoizeStoreStrategyFactory<V>
  ) => m.MemoizeStoreStrategy<string, V>;
  readonly isForeignContentAvailable: () => boolean;
  readonly expireDurationMS: number;
  readonly fileSuffix: string;
  readonly mssStatsInstances?: Map<
    string,
    { readonly key: string; gets: number; sets: number; readonly reject: Error[] }
  >;
}) => {
  const mssStatsFactory = (key: string) => {
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
  const mssFileNameSupplier =
    (key: string) =>
    <V>(_value?: V) =>
      path.join(
        process.cwd(),
        'src',
        'cache',
        'memoized-foreign-content',
        key.replace(invalidChars, '-').replaceAll(/\-+/g, '-')
      ) + fileSuffix;

  const instances = new Map<string, m.MemoizeStoreStrategy<string, any>>();
  return <V>(key: string): m.MemoizeStoreStrategy<string, V> => {
    let instance = instances.get(key);
    if (!instance) {
      const fsMSS = fsssFactory({
        fileNameSupplier: mssFileNameSupplier(key),
        acceptPersistedFile: (stats, fn) => {
          const accept = () => {
            // if we're running in dev mode, always read from fs cache
            if (import.meta.env.DEV) return true;

            if (isForeignContentAvailable()) {
              // if we're running "production" (or "build") mode, only read from cache if not more than a few minutes old
              const ageInMS = Date.now() - stats.mtime.valueOf();
              if (ageInMS > expireDurationMS) return new Error('time expired');
              return true;
            } else {
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
        get: (key: string) => {
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

export const foreignQueryableHtmlMemoizer = (fqhmOptions: {
  readonly isForeignContentAvailable: () => boolean;
  readonly expireDurationMS?: number;
  readonly fileSuffix?: string;
  readonly mssStatsInstances?: Map<
    string,
    { readonly key: string; gets: number; sets: number; readonly reject: Error[] }
  >;
}) => {
  const instances = new Map<string, (...args: any) => Promise<any>>();
  // the Promise type of the return should match Mozilla Readability result
  return (
    url: string,
    args?: {
      readonly extractHTML?: (dom: JSDOM) => string;
      readonly key?: string;
      readonly sanitized?: boolean;
    }
  ): (() => Promise<string>) => {
    const key = args?.key ?? url;
    const extractHTML = args?.extractHTML;
    let instance = instances.get(key);
    if (!instance) {
      instance = m.memoize(
        async () => {
          const dom = await (args?.sanitized
            ? fc.queryableSanitizedContent(url)
            : fc.queryableContent(url));
          return extractHTML ? extractHTML(dom) : dom.serialize();
        },
        foreignContentMssFactory({
          fsssFactory: m.fsTextMemoizeStoreStrategy,
          expireDurationMS: 1000 * 60 * 60 * 12, // default: 12 hour expiration in production, dev always uses cache
          fileSuffix: '.memoized.html',
          ...fqhmOptions,
        })(key)
      );
      instances.set(key, instance);
    }
    return instance;
  };
};

export const foreignReadableHtmlMemoizer = (options: {
  readonly isForeignContentAvailable: () => boolean;
  readonly expireDurationMS?: number;
  readonly fileSuffix?: string;
  readonly mssStatsInstances?: Map<
    string,
    { readonly key: string; gets: number; sets: number; readonly reject: Error[] }
  >;
}) => {
  const instances = new Map<string, (...args: any) => Promise<any>>();
  // the Promise type of the return should match Mozilla Readability result
  return (
    url: string,
    key = url
  ): (() => Promise<{
    /** article title */
    title: string;
    /** author metadata */
    byline: string;
    /** content direction */
    dir: string;
    /** HTML of processed article content */
    content: string;
    /** text content of the article (all HTML removed) */
    textContent: string;
    /** length of an article, in characters */
    length: number;
    /** article description, or short excerpt from the content */
    excerpt: string;
    siteName: string;
  }>) => {
    let instance = instances.get(key);
    if (!instance) {
      instance = m.memoize(
        async () => await fc.readableContent(url),
        foreignContentMssFactory({
          fsssFactory: m.fsJsonMemoizeStoreStrategy,
          expireDurationMS: 1000 * 60 * 60 * 12, // default: 12 hour expiration in production, dev always uses cache
          fileSuffix: '.readability.memoized.json',
          ...options,
        })(key)
      );
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

export async function memoizableForeignContent(foreignContent: fc.ForeignContent) {
  if (!foreignContent.content || foreignContent.content.readable) {
    return (
      (await memoizableForeignReadable(foreignContent.url)())?.content ??
      `memoizableForeignContent:readable-failed`
    );
  }

  const fcc = foreignContent?.content;
  const sanitized = fcc?.unsanitized ? false : true;
  if (fcc.selectFirst || fcc.selectAll) {
    return await memoizableForeignHTML(foreignContent.url, {
      sanitized,
      extractHTML: dom => {
        if (fcc.selectFirst) {
          const first = dom.window.document.querySelector(fcc.selectFirst);
          return first
            ? first.outerHTML
            : fcc.onSelectFail ?? 'memoizableForeignContent:selectFirst-failed';
        }
        if (fcc.selectAll) {
          let text = '';
          const all = dom.window.document.querySelectorAll(fcc.selectAll);
          for (const elem of all) {
            text += elem.outerHTML;
          }
          return text.length > 0
            ? text
            : fcc.onSelectFail ?? 'memoizableForeignContent:selectAll-failed';
        }
        return 'memoizableForeignContent:extractHTML-failed';
      },
    })();
  } else {
    return await memoizableForeignHTML(foreignContent.url, { sanitized })();
  }
}
