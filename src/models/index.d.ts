import { ModelInit, MutableModel } from "@aws-amplify/datastore";

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

export declare class UserSetting {
  readonly id: string;
  readonly trackerAutoStart?: boolean | null;
  readonly trackerStopOnNewStart?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<UserSetting, UserSettingMetaData>);
  static copyOf(source: UserSetting, mutator: (draft: MutableModel<UserSetting, UserSettingMetaData>) => MutableModel<UserSetting, UserSettingMetaData> | void): UserSetting;
}

export declare class WorkLog {
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
  constructor(init: ModelInit<WorkLog, WorkLogMetaData>);
  static copyOf(source: WorkLog, mutator: (draft: MutableModel<WorkLog, WorkLogMetaData>) => MutableModel<WorkLog, WorkLogMetaData> | void): WorkLog;
}

export declare class Tracker {
  readonly id: string;
  readonly title: string;
  readonly logDescription?: string | null;
  readonly startedAt?: string | null;
  readonly state: TrackerState | keyof typeof TrackerState;
  readonly ttid?: string | null;
  readonly logServiceObject?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Tracker, TrackerMetaData>);
  static copyOf(source: Tracker, mutator: (draft: MutableModel<Tracker, TrackerMetaData>) => MutableModel<Tracker, TrackerMetaData> | void): Tracker;
}