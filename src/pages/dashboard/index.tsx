import React, {ReactElement} from "react";
import {Trackers} from "@pages/trackers";
import {WorkLogs} from "@pages/work-logs";

export const Dashboard = (): ReactElement => {
    return (
        <div className='page space-y-5'>
            <h1 className="text-xl text-primary">Dashboard</h1>
            {/* Include trackers */}
            <Trackers/>
            {/* Include work logs */}
            <WorkLogs/>
        </div>
    );
};