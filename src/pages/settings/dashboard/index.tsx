import { UserSettingsContext } from "@context/user-settings";
import { DashboardTrackersPagination, UserSetting } from "@models/index";
import { Loading } from "@pages/loading";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { ReactElement, useContext } from "react";

interface SettingsDashboardProps {
    onUpdate: (userSettings: UserSetting | null, data: UserSetting) => void
}

export const SettingsDashboard = ({ onUpdate }: SettingsDashboardProps): ReactElement => {

    // Get user settings
    const userSettings = useContext(UserSettingsContext);   

    if (!userSettings) {
        return (
            <Loading />
        )
    }

    return (
        <div className="p-2.5 space-y-5">
            {/* Tracker count */}
            <div className="w-1/3 space-y-1">
                <h2 className="text-lg">Trackers Count</h2>
                <DropDownListComponent
                    dataSource={[
                        { text: 'Three', value: DashboardTrackersPagination.THREE },
                        { text: 'Seven', value: DashboardTrackersPagination.SEVEN }
                    ]}
                    fields={{ text: 'text', value: 'value' }}
                    value={userSettings.dashboardTrackersPagination as any}
                    change={(args) => onUpdate(userSettings, { ...userSettings, dashboardTrackersPagination: args.itemData.value })}
                />
                {/* Description */}
                <p>Select how many trackers you want to see in Dashboard</p>
            </div>
        </div>
    )
}