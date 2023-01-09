import { ReactElement } from "react";
import { TabComponent, TabItemDirective, TabItemsDirective } from "@syncfusion/ej2-react-navigations";
import { SettingsTrackers } from "@pages/settings/trackers";
import { UserSetting } from "@models/index";
import { DataStore } from "aws-amplify";
import { SettingsDashboard } from "./dashboard";

export const Settings = (): ReactElement => {

    /**
     * Update user settings
     * @param data 
     */
    const updateUserSettings = async (userSettings: UserSetting | null, data: UserSetting) => {
        // Check if there is a user settings
        if (userSettings) {
            // Change view mode
            await DataStore.save(
                UserSetting.copyOf(userSettings, updated => {
                    updated.trackerAutoStart = data.trackerAutoStart;
                    updated.trackerStopOnNewStart = data.trackerStopOnNewStart;
                    updated.trackerViewSort = data.trackerViewSort;
                    updated.dashboardTrackersPagination = data.dashboardTrackersPagination;
                })
            );
            console.log('Updated user settings');
        }
    }

    return (
        <div className='page'>
            <h1 className="text-2xl text-primary"><i className="fa-solid fa-cog" /> Settings</h1>
            {/* Tabs */}
            <TabComponent heightAdjustMode='Auto' cssClass='mt-5'>
                <TabItemsDirective>
                    <TabItemDirective
                        header={{ text: 'Trackers', iconCss: 'fa-solid fa-stopwatch' }}
                        content={() => <SettingsTrackers onUpdate={updateUserSettings} />}
                    />
                    <TabItemDirective
                        header={{ text: 'Work Logs', iconCss: 'fa-solid fa-business-time' }}
                        content={() => <>Work in progress...</>}
                    />
                    <TabItemDirective
                        header={{ text: 'Dashbaord', iconCss: 'fa-solid fa-house' }}
                        content={() => <SettingsDashboard onUpdate={updateUserSettings} />}
                    />
                    <TabItemDirective
                        header={{ text: 'Notifications', iconCss: 'fa-solid fa-bell' }}
                        content={() => <>Work in progress...</>}
                    />
                </TabItemsDirective>
            </TabComponent>
        </div>
    )
}