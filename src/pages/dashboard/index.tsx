import React, { ReactElement, useContext } from "react";
import { TrackersView } from "@components/trackers-view";
import { WorkLogs } from "@pages/work-logs";
import { DashboardTrackersPagination } from "@models/index";
import { UserSettingsContext } from "@context/user-settings";

export const Dashboard = (): ReactElement => {

    const userSetting = useContext(UserSettingsContext);

    return (
        <div className='page space-y-5'>
            <h1 className="text-xl text-primary">Dashboard</h1>
            {/* Include trackers */}
            <TrackersView
                limit={userSetting?.dashboardTrackersPagination === DashboardTrackersPagination.SEVEN ? 7 : 3}
                userSetting={userSetting || undefined}
            />
            {/* Include work logs */}
            <WorkLogs />
        </div>
    );
};