import {useEffect, useRef, useState} from "react";
import {Tracker, TrackerState} from "@models/index";
import moment from "moment/moment";

export const TrackerDuration = (data: Tracker): string => {

    // Timer
    const timer = useRef<NodeJS.Timer>();
    const [duration, setDuration] = useState<string>('00:00:00');

    useEffect(() => {
        // Check if state is START and startedAt is present
        if (data.state === TrackerState.START && data.startedAt) {
            // Set timer interval
            timer.current = setInterval(() => {
                // Get duration
                setDuration(moment.utc(moment().diff(data.startedAt)).format('HH:mm:ss'));
            }, 1000);
        }
        // Clear timer on change
        return () => {
            // Check if timer is not null
            if (timer.current) {
                // Clear interval
                clearInterval(timer.current);
                // Clear duration
                setDuration('00:00:00');
            }
        }
    }, [data.state, data.startedAt]);

    return (
        duration
    )
}