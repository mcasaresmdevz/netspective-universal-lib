import type { SqlConnState } from './pg-conn';
import * as t from './tree';
export interface Namespace {
    readonly id: number;
    readonly parentID?: number;
    readonly name: string;
    readonly path: string;
    readonly description: string;
    readonly avatar: string;
}
export interface NamespaceContent {
    readonly namespace: Namespace;
    readonly contentCollections: () => Promise<ContentCollections>;
    readonly users: () => Promise<Users>;
}
export declare const namespacesContent: Map<string, NamespaceContent>;
export declare function namespaceContent(conn: SqlConnState, name: string): Promise<NamespaceContent | undefined>;
export declare const gitLabNamespaceQR: (conn: SqlConnState, name: string) => () => Promise<import("postgres").RowList<Namespace[]>>;
export declare const qualifiedComponentsDelim = ":/:";
export type ContentCollectionPathComponent = string;
export type ContentCollectionPath = string;
export type ContentCollectionName = string;
export type ContentCollectionAbbreviation = string;
export interface MutableContentAnalytics {
    todosCount: number;
    viewedCount: number;
    completedCount: number;
    irrelevantCount: number;
    ignoredCount: number;
}
export type ContentAnalytics = Readonly<MutableContentAnalytics>;
export interface ContentCollection {
    readonly url: ContentCollectionPath;
    readonly name: ContentCollectionName;
    readonly abbrev: ContentCollectionAbbreviation;
    readonly groupPathComponent: ContentCollectionPathComponent;
    readonly qualifiedPathComponents: ContentCollectionPathComponent[];
    readonly qualifiedNameComponents: ContentCollectionName[];
    readonly description: string;
    readonly items: Content[];
    readonly analytics: ContentAnalytics;
    readonly register: (assn: Content) => number;
}
export interface ContentCollections {
    readonly namespace: Namespace;
    readonly collections: ContentCollection[];
    readonly pathTree: t.PathTree<{
        cc: ContentCollection;
        content: Content;
    }, Pick<Namespace, 'name'>>;
}
export interface Content extends ContentAnalytics {
    readonly groupURL: string;
    readonly groupPathComponent: string;
    readonly groupName: string;
    readonly groupNameQualified: string;
    readonly groupDescription: string;
    readonly projectURL: string;
    readonly projectPath: string;
    readonly projectName: string;
    readonly projectNameQualified: string;
    readonly projectDescription: string;
    readonly assignmentId: number;
    readonly assignmentIID: number;
    readonly assignmentTitle: string;
    readonly assignmentDescription: string;
    readonly assignmentTitleHTML: string;
    readonly assignmentDescriptionHTML: string;
    readonly assignmentCreatedByUserName: string;
    readonly assignmentCreatedByUserID: number;
    readonly assignmentCreatedAt: Date;
    readonly assignmentDueOn: Date;
    readonly assignmentDueInDays: number;
    readonly authorizedUserIds: number[];
    readonly assignedUserIds: number[];
    readonly mentionedUserIds: number[];
    readonly viewedByUserIds: number[];
    readonly completedByUserIds: number[];
    readonly irrelevantByUserIds: number[];
}
export declare class TypicalContentCollection implements ContentCollection {
    #private;
    static captionPrepRegExp: RegExp;
    readonly url: ContentCollectionPath;
    readonly name: ContentCollectionName;
    readonly abbrev: ContentCollectionAbbreviation;
    readonly groupPathComponent: ContentCollectionPathComponent;
    readonly qualifiedPathComponents: ContentCollectionPathComponent[];
    readonly qualifiedNameComponents: ContentCollectionName[];
    readonly description: string;
    readonly items: Content[];
    constructor(props: Pick<ContentCollection, 'url' | 'description' | 'name' | 'qualifiedNameComponents' | 'qualifiedPathComponents' | 'groupPathComponent'>);
    get analytics(): ContentAnalytics;
    register(assn: Content): number;
}
export declare class TypicalContentCollections implements ContentCollections {
    readonly namespace: Namespace;
    static readonly singleton: (conn: SqlConnState, ns: Namespace) => () => Promise<TypicalContentCollections>;
    readonly collections: ContentCollection[];
    readonly pathTree: t.PathTree<{
        cc: ContentCollection;
        content: Content;
    }, Pick<Namespace, 'name'>>;
    constructor(namespace: Namespace);
    populate(conn: SqlConnState): Promise<ContentCollections>;
}
export declare const gitLabIssuesQR: (conn: SqlConnState, namespace: Namespace) => () => Promise<import("postgres").RowList<{
    groupURL: string;
    groupPathComponent: string;
    groupName: string;
    groupNameQualified: string;
    groupDescription: string;
    projectPath: string;
    projectName: string;
    projectNameQualified: string;
    projectDescription: string;
    assignmentId: number;
    assignmentIID: number;
    projectURL: string;
    assignmentTitleHTML: string;
    assignmentDescriptionHTML: string;
    assignmentTitle: string;
    assignmentDescription: string;
    assignmentCreatedByUserName: string;
    assignmentCreatedByUserID: number;
    assignmentCreatedAt: Date;
    assignmentDueOn: Date;
    assignmentDueInDays: number;
    todosCount: number;
    viewedCount: number;
    completedCount: number;
    irrelevantCount: number;
    ignoredCount: number;
    authorizedUserIds: number[];
    assignedUserIds: number[];
    mentionedUserIds: number[];
    viewedByUserIds: number[];
    completedByUserIds: number[];
    irrelevantByUserIds: number[];
}[]>>;
export interface User {
    readonly id: number;
    readonly email: string;
    readonly name: string;
    readonly userName: string;
}
export interface UserAnalytics extends User {
    readonly authoredIssuesCount: number;
    readonly assignedIssuesCount: number;
    readonly mentionedInIssuesCount: number;
    readonly viewedReactionsCount: number;
    readonly irrelevantReactionsCount: number;
    readonly completedReactionsCount: number;
    readonly incompleteMentionsCount: number;
    readonly ignoredMentionsCount: number;
}
export interface Users {
    readonly namespace: Namespace;
    readonly users: UserAnalytics[];
}
export declare class TypicalUsers implements Users {
    readonly namespace: Namespace;
    static readonly singleton: (conn: SqlConnState, ns: Namespace) => () => Promise<TypicalUsers>;
    readonly users: UserAnalytics[];
    constructor(namespace: Namespace);
    populate(conn: SqlConnState): Promise<Users>;
}
export declare const gitLabUsersAnalyticsQR: (conn: SqlConnState, namespace: Namespace) => () => Promise<import("postgres").RowList<{
    id: number;
    email: string;
    name: string;
    userName: string;
    authoredIssuesCount: number;
    assignedIssuesCount: number;
    mentionedInIssuesCount: number;
    viewedReactionsCount: number;
    irrelevantReactionsCount: number;
    completedReactionsCount: number;
    incompleteMentionsCount: number;
    ignoredMentionsCount: number;
}[]>>;
