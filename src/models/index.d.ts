import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum DashboardTrackersPagination {
  THREE = "THREE",
  SEVEN = "SEVEN"
}

export enum TrackerViewSort {
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT"
}

export enum Languages {
  IT = "IT",
  EN = "EN"
}

export enum TrackerViewModes {
  CARD = "CARD",
  GRID = "GRID"
}

export enum WorkLogState {
  PENDING = "PENDING",
  LOGGED = "LOGGED",
  DELETED = "DELETED",
  MERGED = "MERGED"
}

export enum TrackerState {
  STOP = "STOP",
  START = "START",
  PAUSE = "PAUSE"
}

type UserSettingMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type WorkLogMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TrackerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerUserSetting = {
  readonly id: string;
  readonly language?: Languages | keyof typeof Languages | null;
  readonly trackerAutoStart?: boolean | null;
  readonly trackerStopOnNewStart?: boolean | null;
  readonly trackerViewMode?: TrackerViewModes | keyof typeof TrackerViewModes | null;
  readonly trackerViewSort?: TrackerViewSort | keyof typeof TrackerViewSort | null;
  readonly dashboardTrackersPagination?: DashboardTrackersPagination | keyof typeof DashboardTrackersPagination | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserSetting = {
  readonly id: string;
  readonly language?: Languages | keyof typeof Languages | null;
  readonly trackerAutoStart?: boolean | null;
  readonly trackerStopOnNewStart?: boolean | null;
  readonly trackerViewMode?: TrackerViewModes | keyof typeof TrackerViewModes | null;
  readonly trackerViewSort?: TrackerViewSort | keyof typeof TrackerViewSort | null;
  readonly dashboardTrackersPagination?: DashboardTrackersPagination | keyof typeof DashboardTrackersPagination | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserSetting = LazyLoading extends LazyLoadingDisabled ? EagerUserSetting : LazyUserSetting

export declare const UserSetting: (new (init: ModelInit<UserSetting, UserSettingMetaData>) => UserSetting) & {
  copyOf(source: UserSetting, mutator: (draft: MutableModel<UserSetting, UserSettingMetaData>) => MutableModel<UserSetting, UserSettingMetaData> | void): UserSetting;
}

type EagerWorkLog = {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly startedAt: string;
  readonly endedAt: string;
  readonly ttid?: string | null;
  readonly logServiceObject?: string | null;
  readonly state: WorkLogState | keyof typeof WorkLogState;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyWorkLog = {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly startedAt: string;
  readonly endedAt: string;
  readonly ttid?: string | null;
  readonly logServiceObject?: string | null;
  readonly state: WorkLogState | keyof typeof WorkLogState;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type WorkLog = LazyLoading extends LazyLoadingDisabled ? EagerWorkLog : LazyWorkLog

export declare const WorkLog: (new (init: ModelInit<WorkLog, WorkLogMetaData>) => WorkLog) & {
  copyOf(source: WorkLog, mutator: (draft: MutableModel<WorkLog, WorkLogMetaData>) => MutableModel<WorkLog, WorkLogMetaData> | void): WorkLog;
}

type EagerTracker = {
  readonly id: string;
  readonly title: string;
  readonly logDescription?: string | null;
  readonly startedAt?: string | null;
  readonly state: TrackerState | keyof typeof TrackerState;
  readonly ttid?: string | null;
  readonly logServiceObject?: string | null;
  readonly favorite?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTracker = {
  readonly id: string;
  readonly title: string;
  readonly logDescription?: string | null;
  readonly startedAt?: string | null;
  readonly state: TrackerState | keyof typeof TrackerState;
  readonly ttid?: string | null;
  readonly logServiceObject?: string | null;
  readonly favorite?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Tracker = LazyLoading extends LazyLoadingDisabled ? EagerTracker : LazyTracker

export declare const Tracker: (new (init: ModelInit<Tracker, TrackerMetaData>) => Tracker) & {
  copyOf(source: Tracker, mutator: (draft: MutableModel<Tracker, TrackerMetaData>) => MutableModel<Tracker, TrackerMetaData> | void): Tracker;
}