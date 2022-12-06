import {ReactElement} from "react";
import {SettingsSwitch} from "@components/settings-toggle-option";

export const SettingsTrackers = (): ReactElement => {
    return (
        <div className='p-2.5 space-y-5'>
            {/* Auto start */}
            <SettingsSwitch
                title='Tracker Auto-Start'
                description='On create a new tracker start it automatically'
                value={false}
                onChange={(value) => console.log(value)}
            />
            {/* Auto start */}
            <SettingsSwitch
                title='Pause Tracker on new start'
                description='Pause current Tracker when new Tracker start'
                value={false}
                onChange={(value) => console.log(value)}
            />
        </div>
    )
}