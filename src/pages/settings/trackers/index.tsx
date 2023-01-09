import { ReactElement, useContext } from "react";
import { SettingsSwitch } from "@components/settings-toggle-option";
import { UserSettingsContext } from "@context/user-settings";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { TrackerViewSort, UserSetting } from "@models/index";
import { Loading } from "@pages/loading";

interface SettingsTrackersProps {
    onUpdate: (userSettings: UserSetting | null, data: UserSetting) => void
}

export const SettingsTrackers = ({ onUpdate }: SettingsTrackersProps): ReactElement => {

    // Get user settings
    const userSettings = useContext(UserSettingsContext);

    if (!userSettings) {
        return (
            <Loading />
        )
    }

    return (
        <div className='p-2.5 space-y-5'>
            {/* Auto start */}
            <SettingsSwitch
                title='Tracker Auto-Start'
                description='On create a new tracker start it automatically'
                value={!!userSettings.trackerAutoStart}
                onChange={(value) => onUpdate(userSettings, { ...userSettings, trackerAutoStart: value })}
            />
            {/* Auto start */}
            <SettingsSwitch
                title='Pause Tracker on new start'
                description='Pause current Tracker when new Tracker start'
                value={!!userSettings.trackerStopOnNewStart}
                onChange={(value) => onUpdate(userSettings, { ...userSettings, trackerStopOnNewStart: value })}
            />
            {/* Trackers sort */}
            <div className="w-1/3 space-y-1">
                <h2 className="text-lg">Trackers Sort</h2>
                <DropDownListComponent
                    dataSource={[
                        { text: 'Creation', value: TrackerViewSort.CREATED_AT },
                        { text: 'Last update', value: TrackerViewSort.UPDATED_AT }
                    ]}
                    fields={{ text: 'text', value: 'value' }}
                    value={userSettings.trackerViewSort as any}
                    change={(args) => onUpdate(userSettings, { ...userSettings, trackerViewSort: args.itemData.value })}
                />
                {/* Description */}
                <p>Select the order of your trackers in Dashboard and Trackers page</p>
            </div>
        </div>
    )
}