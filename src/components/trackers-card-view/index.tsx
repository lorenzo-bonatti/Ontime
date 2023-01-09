import React from "react";
import {TrackerTimer} from "@components/tracker-timer";
import {AddTracker} from "@components/add-tracker";
import {Tracker} from "@models/index";

interface Props {
    trackers: Tracker[]
    onAddTracker: () => Promise<void>
    onStartTracker: (tracker: Tracker) => Promise<void>
    onUpdateTracker: (tracker: Tracker) => Promise<void>
    onFinishTracker: (tracker: Tracker, isPause?: boolean) => Promise<void>
    onDeleteTracker: (tracker: Tracker) => Promise<void>
}

export const TrackersCardView = (
    {
        trackers,
        onAddTracker,
        onStartTracker,
        onUpdateTracker,
        onFinishTracker,
        onDeleteTracker
    }: Props) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {
                // Each tracker
                trackers.map(tracker => (
                    <TrackerTimer
                        key={tracker.id}
                        tracker={tracker}
                        onStart={onStartTracker}
                        onUpdate={onUpdateTracker}
                        onFinish={onFinishTracker}
                        onDelete={onDeleteTracker}
                    />
                ))
            }
            {/* Add Tracker */}
            <AddTracker
                onDefaultTracker={() => onAddTracker()}
                onNormalTracker={() => onAddTracker()}
            />
        </div>
    )
}