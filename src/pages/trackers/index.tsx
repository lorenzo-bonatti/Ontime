import { TrackerViewModes, UserSetting } from "@models/index";
import { DataStore } from 'aws-amplify';
import React, { ReactElement, useContext, useState } from "react";
import { AppBarComponent } from "@syncfusion/ej2-react-navigations";
import { delayCallback } from "../../utils";
import { TrackersView } from "@components/trackers-view";
import { UserSettingsContext } from "@context/user-settings";

export const Trackers = (): ReactElement => {

    const userSetting = useContext(UserSettingsContext);

    // States
    const [filter, setFilter] = useState<string>('');

    const onFilter = (text: string) => {
        // Delay action
        delayCallback(() => {
            // Setup filters
            setFilter(text);
        })
    }

    const changeTrackersViewMode = async (mode: TrackerViewModes) => {
        // Check if there is a user settings
        if (userSetting) {
            // Change view mode
            await DataStore.save(
                UserSetting.copyOf(userSetting, updated => {
                    updated.trackerViewMode = mode;
                })
            );
        } else {
            // Create new user settings
            await DataStore.save(
                new UserSetting({
                    trackerViewMode: mode
                })
            )
        }
    }

    return (
        <div className='page'>
            {/* AppBar - Title */}
            <AppBarComponent cssClass='page-bar'>
                <h1 className="page-title"><i className="fa-solid fa-stopwatch" /> Trackers</h1>
                <div className="e-appbar-spacer"></div>
                {/* Actions bar */}
                <div className='flex items-center space-x-5'>
                    {/* Search input */}
                    <div className="e-input-group">
                        <input
                            type="text"
                            placeholder="Search"
                            className="e-input"
                            onChange={(args) => onFilter(args.target.value)}
                        />
                        <span className="e-input-group-icon fa-solid fa-search" />
                    </div>
                    {/* Switch layout view */}
                    <div className="e-btn-group">
                        {/* Card */}
                        <input
                            type="radio"
                            id="trackers-card-layout"
                            name="trackers-layout"
                            checked={!userSetting || userSetting?.trackerViewMode === TrackerViewModes.CARD}
                        />
                        <label
                            htmlFor="trackers-card-layout"
                            className="e-btn e-outline e-primary"
                            onClick={() => changeTrackersViewMode(TrackerViewModes.CARD)}
                        >
                            <i className="fa-solid fa-table-columns" />
                        </label>
                        {/* Grid */}
                        <input
                            type="radio"
                            id="trackers-grid-layout"
                            name="trackers-layout"
                            checked={userSetting?.trackerViewMode === TrackerViewModes.GRID}
                        />
                        <label
                            htmlFor="trackers-grid-layout"
                            className="e-btn e-outline e-primary"
                            onClick={() => changeTrackersViewMode(TrackerViewModes.GRID)}
                        >
                            <i className="fa-solid fa-table-list" />
                        </label>
                    </div>
                </div>
            </AppBarComponent>
            {/* Trackers */}
            <TrackersView
                predicates={(t: any) => t.or((t: any) => t.title('contains', filter))}
                userSetting={userSetting || undefined}
            />
        </div>
    )
}