import { UserSetting } from "@models/index";
import { createContext } from "react";

export const UserSettingsContext = createContext<UserSetting | null>(null);
export const UserSettingsProvider = UserSettingsContext.Provider;
