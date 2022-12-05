import React, {ReactElement, Reducer, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {Tracker, TrackerState} from '@models/index';
import moment from 'moment';
import {TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';
import {v4 as uuidV4} from 'uuid';
import {DialogUtility} from '@syncfusion/ej2-popups';
import {Dialog} from '@syncfusion/ej2-react-popups';
import {delayCallback} from '../../utils';

interface TrackerTimerProps {
    /**
     * Tracker element
     */
    tracker: Tracker
    /**
     * On start
     */
    onStart: (tracker: Tracker) => Promise<void>
    /**
     * Update tracker data
     */
    onUpdate: (tracker: Tracker) => Promise<void>
    /**
     * On finish tracker
     */
    onFinish: (tracker: Tracker, isPause?: boolean) => Promise<void>
    /**
     * On delete tracker
     */
    onDelete: (tracker: Tracker) => Promise<void>
}

/**
 * Tracker timer
 * @param tracker
 * @param onStart
 * @param onUpdate
 * @param onFinish
 * @param onDelete
 * @constructor
 */
export const TrackerTimer = (
    {
        tracker,
        onStart,
        onUpdate,
        onFinish,
        onDelete
    }: TrackerTimerProps): ReactElement => {

    interface ReducerData {
        data: Tracker,
        prev: any
    }

    // Setup tracker reducer
    const [{data, prev}, dispatch] = useReducer<Reducer<ReducerData, any>>((state, payload: any) => {
        switch (payload.action) {
            case "UPDATE":
                return {
                    data: {
                        ...state.data,
                        ...payload.data
                    },
                    prev: state
                }
            case "RESET":
                return {
                    data: payload.data,
                    prev: null
                }
            case "RESTORE":
                return {
                    data: state.prev?.data || tracker,
                    prev: null
                }
            default:
                return state;
        }
    }, {data: tracker, prev: null});

    // Timer duration
    const timer = useRef<NodeJS.Timer>();
    const [duration, setDuration] = useState<string>('00:00:00');

    // Listen updates from parent
    useEffect(() => {
        // Update reducer
        dispatch({action: "RESET", data: tracker});
    }, [tracker]);

    useEffect(() => {
        // Check if is an update
        if (prev) {
            // Callback changes
            delayCallback(() => onUpdate(data).catch(() => {
                // Restore prev. state
                dispatch({action: "RESTORE"});
            }));
        }
    }, [data, prev]);

    /**
     * Timer
     * Setup interval and calculate the time difference
     * from the start and the current time
     */
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

    const start = async () => {
        try {
            // Callback on start
            await onStart(data);
        } catch (e) {
            console.error(e);
        }
    }

    const pause = async () => {
        try {
            // Callback on finish
            await onFinish(data, true);
        } catch (e) {
            console.error(e);
        }
    }

    const finish = async () => {
        try {
            // Callback on finish
            await onFinish(data);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Delete tracker (callback)
     */
    const deleteTracker = () => {
        // Confirm dialog
        DialogUtility.confirm({
            title: 'Elimina Tracker',
            content: `
				<p>Sei sicuro/a di voler eliminare questo Tracker ?</p>
				${data.state === TrackerState.START ? '<b>Il Tracker in corso non sarà salvato</b>' : ''}
			`,
            okButton: {
                text: 'Elimina',
                icon: 'fa-solid fa-trash',
                click: async function (args: any) {
                    // Disable button
                    args.target.disabled = true;
                    try {
                        // Call delete callback
                        await onDelete(data);
                        // Close dialog
                        (this as Dialog).hide();
                    } catch (e) {
                        // Log error
                        console.error('deleteTracker', {e});
                    }
                }
            },
            cancelButton: {text: 'Annulla'},
            showCloseIcon: true
        });
    }

    // Date picker memo
    const StartAtMemo = useMemo(() => (
        <DateTimePickerComponent
            placeholder="Start at"
            floatLabelType='Auto'
            value={data.startedAt as any}
            change={(args) => dispatch({
                action: "UPDATE",
                data: {startedAt: args.value ? moment(args.value).utc().toISOString() : null}
            })}
        />
    ), [data.startedAt]);

    return (
        <div>
            {/* Title */}
            <TextBoxComponent
                placeholder='Title'
                floatLabelType='Auto'
                value={data.title}
                change={(args) => dispatch({
                    action: "UPDATE",
                    data: {title: args.value || 'Ontime tracker'}
                })}
            />
            {/* Log description */}
            <TextBoxComponent
                placeholder='Log description'
                floatLabelType='Auto'
                multiline
                htmlAttributes={{rows: '4'}}
                value={data.logDescription as any}
                change={(args) => dispatch({
                    action: "UPDATE",
                    data: {logDescription: args.value}
                })}
            />
            {/* Start at */}
            {StartAtMemo}
            {/* Duration */}
            <p>Duration: {duration}</p>
            {/* Action buttons */}
            <div className="flex justify-around space-x-2.5">
                {
                    // Check state
                    data.state === TrackerState.STOP || data.state === TrackerState.PAUSE
                        ? <ButtonComponent
                            content="Start"
                            iconCss="fa-solid fa-play"
                            isPrimary
                            cssClass='action-button'
                            onClick={() => start()}
                        />
                        : <>
                            {/* Finish */}
                            <ButtonComponent
                                content="Finish"
                                iconCss="fa-solid fa-flag-checkered"
                                isPrimary
                                cssClass='action-button'
                                onClick={() => finish()}
                            />
                            {/* Pause */}
                            <ButtonComponent
                                content="Pause"
                                iconCss="fa-solid fa-pause"
                                cssClass='action-button'
                                onClick={() => pause()}
                            />
                        </>
                }
                {/* Delete button */}
                <ButtonComponent
                    content="Delete"
                    iconCss="fa-solid fa-trash"
                    cssClass='action-button'
                    onClick={() => deleteTracker()}
                />
            </div>
        </div>
    );
};