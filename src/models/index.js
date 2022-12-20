// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

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
  Languages,
  TrackerViewModes,
  WorkLogState,
  TrackerState
};