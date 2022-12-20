import React, {ReactElement, Reducer, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {Tracker, TrackerState} from '@models/index';
import moment from 'moment';
import {TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';
import {DialogUtility} from '@syncfusion/ej2-popups';
import {Dialog} from '@syncfusion/ej2-react-popups';
import {delayCallback} from '../../utils';
import {TrackerDuration} from "@components/tracker-duration";

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

    const beforeFinish = async () => {
        // Check current tracker state
        if (tracker.state === TrackerState.PAUSE) {
            // Update tracker
            dispatch({
                action: "UPDATE",
                data: {
                    ...tracker,
                    logDescription: null,
                    startedAt: null,
                    ttid: null,
                    state: TrackerState.STOP
                }
            })
        } else if (tracker.state === TrackerState.START) {
            // Finish the tracking
            await finish();
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
        <div className='tracker'>
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
                htmlAttributes={{rows: '3'}}
                value={data.logDescription as any}
                change={(args) => dispatch({
                    action: "UPDATE",
                    data: {logDescription: args.value}
                })}
            />
            {/* Date */}
            <div>
                {/* Start at */}
                {StartAtMemo}
                <p className='text-sm p-1'>Duration: {TrackerDuration(data)}</p>
            </div>
            {/* Action buttons */}
            <div className="flex flex-row space-x-2.5">
                {
                    // Start / Resume button
                    data.state === TrackerState.STOP || data.state === TrackerState.PAUSE
                        ? <ButtonComponent
                            content={data.state === TrackerState.STOP ? 'Start' : 'Resume'}
                            iconCss="fa-solid fa-play"
                            isPrimary
                            cssClass='flex-1 h-10'
                            onClick={() => start()}
                        />
                        : <></>
                }
                {
                    // Finish button
                    data.state === TrackerState.START || data.state === TrackerState.PAUSE
                        ? <ButtonComponent
                            content="Finish"
                            iconCss="fa-solid fa-flag-checkered"
                            isPrimary={true}
                            cssClass={`flex-1 h-10 ${data.state === TrackerState.PAUSE ? 'e-outline e-primary' : 'e-primary'}`}
                            onClick={() => beforeFinish()}
                        />
                        : <></>
                }
                {
                    // Pause button
                    data.state === TrackerState.START
                        ? <ButtonComponent
                            content="Pause"
                            iconCss="fa-solid fa-pause"
                            cssClass='flex-1 h-10'
                            onClick={() => pause()}
                        />
                        : <></>
                }
                {/* Delete button */}
                <ButtonComponent
                    iconCss="fa-solid fa-trash"
                    cssClass='flex-none h-10'
                    onClick={() => deleteTracker()}
                />
            </div>
        </div>
    );
};