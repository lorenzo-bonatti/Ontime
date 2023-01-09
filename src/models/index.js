// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const DashboardTrackersPagination = {
  "THREE": "THREE",
  "SEVEN": "SEVEN"
};

const TrackerViewSort = {
  "CREATED_AT": "CREATED_AT",
  "UPDATED_AT": "UPDATED_AT"
};

const Languages = {
  "IT": "IT",
  "EN": "EN"
};

const TrackerViewModes = {
  "CARD": "CARD",
  "GRID": "GRID"
};

const WorkLogState = {
  "PENDING": "PENDING",
  "LOGGED": "LOGGED",
  "DELETED": "DELETED",
  "MERGED": "MERGED"
};

const TrackerState = {
  "STOP": "STOP",
  "START": "START",
  "PAUSE": "PAUSE"
};

const { UserSetting, WorkLog, Tracker } = initSchema(schema);

export {
  UserSetting,
  WorkLog,
  Tracker,
  DashboardTrackersPagination,
  TrackerViewSort,
  Languages,
  TrackerViewModes,
  WorkLogState,
  TrackerState
};