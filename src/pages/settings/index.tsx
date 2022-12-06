import {ReactElement} from "react";
import {TabComponent, TabItemDirective, TabItemsDirective} from "@syncfusion/ej2-react-navigations";
import {SettingsTrackers} from "@pages/settings/trackers";

export const Settings = (): ReactElement => {
    return (
        <div className='page'>
            <h1 className="text-2xl text-primary"><i className="fa-solid fa-cog"/> Settings</h1>
            {/* Tabs */}
            <TabComponent heightAdjustMode='Auto' cssClass='mt-5'>
                <TabItemsDirective>
                    <TabItemDirective
                        header={{text: 'Trackers', iconCss: 'fa-solid fa-stopwatch'}}
                        content={() => <SettingsTrackers/>}
                    />
                    <TabItemDirective
                        header={{text: 'Work Logs', iconCss: 'fa-solid fa-business-time'}}
                        content={() => <>Work in progress...</>}
                    />
                    <TabItemDirective
                        header={{text: 'Notifications', iconCss: 'fa-solid fa-bell'}}
                        content={() => <>Work in progress...</>}
                    />
                </TabItemsDirective>
            </TabComponent>
        </div>
    )
}