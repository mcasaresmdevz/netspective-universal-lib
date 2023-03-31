// ======== Components ======== //
// export { default as ActionItem } from './components/ActionItem.astro';
// export { default as AgGridComponent } from './components/AGGrid.web.js';
// export { default as ApacheEChartsComponent } from './components/ApacheEcharts.web.js';
// export { default as ChartJsComponent } from './components/ChartJS.web';
// export { default as DiagramsNetViewerComponent } from './components/DiagramsNet.web';
// export { default as KrokiComponent } from './components/KrokiDiagram.web';
// export { default as MarkmapComponent } from './components/MarkmapDiagram.web';
// export { default as ReadabilityComponent } from './components/Readability.web';
// export { default as TimeAgoSpanElement } from './components/TimeAgo.web';
// export { default as TimeDurationSpanElement } from './components/TimeDurationNarrative.web';
// export { default as WordCountElement } from './components/WordCount.web';

// ======== Lib ======== //
export { detectFileSysStyleRoute } from './lib/detect-route.js';
export {
  atTimestamp,
  primaryKeyFK,
  snakeToCamelCase,
  tableBuilderAide,
} from './lib/drizzle-aide.js';
export {
  type ForeignContent,
  foreignContentSchema,
  queryableContent,
  queryableSanitizedContent,
  readableContent,
} from './lib/foreign-content.js';
export { walkFsEntries, type WalkEntry } from './lib/fs-walk.js';
export {
  copyFileIfNewer,
  copyFileIfNewerMemoizeEffects,
  type CopyFileIfNewerEffects,
} from './lib/fs.js';
export type {
  HealthServiceStatus,
  HealthServiceStatusEndpoint,
  HealthyServiceHealthComponentStatus,
  HealthyServiceStatus,
  ServiceHealthAffectable,
  ServiceHealthAffectedEndpoints,
  ServiceHealthComponent,
  ServiceHealthComponentChecks,
  ServiceHealthComponentName,
  ServiceHealthComponentStatus,
  ServiceHealthComponentType,
  ServiceHealthComponents,
  ServiceHealthDiagnosable,
  ServiceHealthIdentity,
  ServiceHealthLinkable,
  ServiceHealthLinks,
  ServiceHealthObservation,
  ServiceHealthObservedUnit,
  ServiceHealthObservedValue,
  ServiceHealthState,
  ServiceHealthStatusable,
  ServiceHealthSupplier,
  ServiceHealthVersioned,
  TypeGuard,
  TypicalServiceHealthMetricName,
  UnhealthyServiceHealthComponentStatus,
  UnhealthyServiceStatus,
} from './lib/health.js';
export {
  defaultLinks,
  healthStatusEndpoint,
  healthyComponent,
  healthyService,
  isHealthy,
  isServiceHealthAffectable,
  isServiceHealthComponents,
  isServiceHealthDiagnosable,
  isServiceHealthIdentity,
  isServiceHealthLinkable,
  isServiceHealthStatus,
  isServiceHealthSupplier,
  isServiceHealthVersioned,
  isUnhealthy,
  typeGuard,
  unhealthyComponent,
  unhealthyService,
} from './lib/health.js';
export { humanFriendlyBytes, humanFriendlyPhrase, humanPath } from './lib/human.js';
export type { TextInterpolateStrategy, TextInterpolator } from './lib/interpolate.js';
export { textInterpolator } from './lib/interpolate.js';
export { type KnowledgeGraph } from './lib/knowledge.js';
export { apiMssFactory, memoizableApiResponse } from './lib/memoize-api.js';
export {
  foreignContentMssFactory,
  foreignQueryableHtmlMemoizer,
  foreignReadableHtmlMemoizer,
  memoizableForeignContent,
  memoizableForeignHTML,
  memoizableForeignReadable,
} from './lib/memoize-foreign-content.js';
export type { FileSysMemoizeStoreStrategyFactory, MemoizeStoreStrategy } from './lib/memoize.js';
export {
  ensureFsPathExists,
  fsJsonMemoizeStoreStrategy,
  fsTextMemoizeStoreStrategy,
  memIdMemoizeStoreStrategy,
  memMemoizeStoreStrategy,
  memoize,
  memoizeSchema,
  singleton,
  singletonSync,
} from './lib/memoize.js';
export type {
  OpenGraph,
  OpenGraphCustom,
  OpenGraphField,
  OpenGraphImage,
  OpenGraphMedia,
  OpenGraphMusicSong,
  OpenGraphTwitterImage,
  OpenGraphTwitterPlayer,
  OpenGraphVideo,
} from './lib/open-graph.js';
export type {
  DatabasesConfiguration,
  PostgreSqlConnID,
  PostgreSqlConnURL,
  PostgreSqlDefaultConnID,
  SqlConnState,
} from './lib/pg-conn.js';
export {
  dbConfigureFromText,
  dbConnsEnvConfigSchema,
  dbConnsFactory,
  memoizableSqlResults,
  mssFactory,
  pgConnUrlPattern,
  prepareConnsFactory,
} from './lib/pg-conn.js';
export type {
  Content,
  ContentAnalytics,
  ContentCollection,
  ContentCollectionAbbreviation,
  ContentCollectionName,
  ContentCollectionPath,
  ContentCollectionPathComponent,
  ContentCollections,
  MutableContentAnalytics,
  Namespace,
  NamespaceContent,
  TypicalContentCollection,
  TypicalContentCollections,
  TypicalUsers,
  User,
  UserAnalytics,
  Users,
} from './lib/pg-gitlab-cms.js';
export {
  gitLabIssuesQR,
  gitLabNamespaceQR,
  gitLabUsersAnalyticsQR,
  namespaceContent,
  namespacesContent,
  qualifiedComponentsDelim,
} from './lib/pg-gitlab-cms.js';
export type {
  ApacheEChartsPluginConfig,
  ApacheEChartsPluginState,
  ApacheEChartsVfileDataShape,
  ChartJsPluginConfig,
  ChartJsPluginState,
  ChartJsVfileDataShape,
} from './lib/remark-chart.js';
export { apacheEChartsPluginSchema, chartJsSchema, remarkPlugin } from './lib/remark-chart.js';
export {
  type RelocationPaths,
  remarkRewritePreviewableURLs,
  typicalTransformRelativePublicSrcAbsUrlWithoutPublic,
  typicalTransformRelativePublicSrcAbsUrlWithoutPublicFn,
} from './lib/remark-rewrite-previewable-url.js';
export { remarkValidateResources } from './lib/remark-validate-resources.js';
export { type SlugifyOptions, slugifier } from './lib/slug.js';
export type { TreePathwayUnitSupplier, TreePathwaysSupplier } from './lib/tree-pathway.js';
export { treePathwaysPreparer } from './lib/tree-pathway.js';
export type {
  PathTree,
  PathTreeItermediarySupplier,
  PathTreeNode,
  PathTreeTerminalSupplier,
} from './lib/tree.js';
export {
  absolutePath,
  pathTree,
  pathTreeDescendants,
  pathTreeIndex,
  pathTreeNodesList,
  populatePathTree,
  populatePathTreeNodes,
  qualifiedPathPreparer,
  selectTreeNode,
  selectTreePath,
  treeOf,
} from './lib/tree.js';
export type {
  EditableSourceFilePathAndName,
  EditableSourceURI,
  EditableTargetURI,
  GitAsset,
  GitAssetUrlResolverIdentity,
  GitBranchOrTag,
  GitDir,
  GitEntry,
  GitPathsSupplier,
  GitRemoteAnchor,
  GitTag,
  GitWorkTreeAsset,
  GitWorkTreeAssetResolver,
  GitWorkTreeAssetUrlResolver,
  GitWorkTreeAssetUrlResolvers,
  GitWorkTreePath,
  ManagedGitReference,
  ManagedGitResolvers,
  RouteGitRemoteResolver,
  VsCodeSshWorkspaceEditorTarget,
  VsCodeWslWorkspaceEditorTarget,
  WorkspaceEditorIdentity,
  WorkspaceEditorTarget,
  WorkspaceEditorTargetResolver,
} from './lib/workspace.js';
export {
  fromFileUrl,
  gitLabAssetUrlResolver,
  gitLabRemoteID,
  gitLabResolvers,
  gitLabWorkTreeAssetVsCodeURL,
  typicalGitWorkTreeAssetResolver,
  typicalGitWorkTreeAssetUrlResolvers,
  vsCodeLocalID,
  vscodeLinuxRemoteEditorResolver,
  vscodeMacRemoteEditorResolver,
  vscodeSshRemoteEditorResolver,
  vscodeWindowsRemoteEditorResolver,
  vscodeWslRemoteEditorResolver,
  workspaceEditorResolver,
  workspaceEditorTargetResolvers,
} from './lib/workspace.js';

// export { remarkDiagram } from './lib/remark-diagram.js';
// export { remarkReadingTime } from './lib/remark-reading-time.js';
// export { remarkRewriteLinks, replaceAsync, rewriteJSXURL } from './lib/remark-rewrite-links.js';
