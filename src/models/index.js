// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

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
  WorkLogState,
  TrackerState
};