import commonEn from "../../locales/en/common.json";
import authEn from "../../locales/en/auth.json";
import navigationEn from "../../locales/en/navigation.json";
import feedEn from "../../locales/en/feed.json";
import settingsEn from "../../locales/en/settings.json";
import validationEn from "../../locales/en/validation.json";
import errorsEn from "../../locales/en/errors.json";
import emptyStatesEn from "../../locales/en/emptyStates.json";
import activityEn from "../../locales/en/activity.json";
import discoverEn from "../../locales/en/discover.json";
import createActivityEn from "../../locales/en/create-activity.json";
import usersEn from "../../locales/en/users.json";
import profileEn from "../../locales/en/profile.json";

import commonKa from "../../locales/ka/common.json";
import authKa from "../../locales/ka/auth.json";
import navigationKa from "../../locales/ka/navigation.json";
import feedKa from "../../locales/ka/feed.json";
import settingsKa from "../../locales/ka/settings.json";
import validationKa from "../../locales/ka/validation.json";
import errorsKa from "../../locales/ka/errors.json";
import emptyStatesKa from "../../locales/ka/emptyStates.json";
import activityKa from "../../locales/ka/activity.json";
import discoverKa from "../../locales/ka/discover.json";
import createActivityKa from "../../locales/ka/create-activity.json";
import usersKa from "../../locales/ka/users.json";
import profileKa from "../../locales/ka/profile.json";

export const namespaces = [
  "common",
  "auth",
  "navigation",
  "feed",
  "settings",
  "validation",
  "errors",
  "emptyStates",
  "activity",
  "discover",
  "create-activity",
  "users",
  "profile",
] as const;

export type AppNamespace = (typeof namespaces)[number];
export const defaultNamespace: AppNamespace = "common";

export const resources = {
  en: {
    common: commonEn,
    auth: authEn,
    navigation: navigationEn,
    feed: feedEn,
    settings: settingsEn,
    validation: validationEn,
    errors: errorsEn,
    emptyStates: emptyStatesEn,
    activity: activityEn,
    discover: discoverEn,
    "create-activity": createActivityEn,
    users: usersEn,
    profile: profileEn,
  },
  ka: {
    common: commonKa,
    auth: authKa,
    navigation: navigationKa,
    feed: feedKa,
    settings: settingsKa,
    validation: validationKa,
    errors: errorsKa,
    emptyStates: emptyStatesKa,
    activity: activityKa,
    discover: discoverKa,
    "create-activity": createActivityKa,
    users: usersKa,
    profile: profileKa,
  },
} as const;
