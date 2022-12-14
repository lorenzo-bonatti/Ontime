import {AddTracker} from "@components/add-tracker";
import {Tracker, TrackerState, WorkLog, WorkLogState} from "@models/index";
import {Error} from "@pages/error";
import {SkeletonComponent} from "@syncfusion/ej2-react-notifications";
import {DataStore} from 'aws-amplify';
import React, {ReactElement, Reducer, useEffect, useReducer} from "react";
import {useStoreDispatch} from "../../store";
import {showFeedback} from "../../store/feedback";
import {TrackerTimer} from "@components/tracker-timer";
import moment from "moment";
import {v4 as uuidV4} from 'uuid';

export const Trackers = (): ReactElement => {

    // Store
    const storeDispatch = useStoreDispatch();

    // Reducer types
    interface ReducerData {
        trackers: Tracker[],
        loading: boolean,
        error: string | null
    }

    interface ReducerPayload {
        type: string
        data?: Tracker[]
        error?: string
    }

    // Setup reducer
    const [{
        trackers,
        loading,
        error
    }, dispatch] = useReducer<Reducer<ReducerData, ReducerPayload>>((state, payload) => {
        switch (payload.type) {
            case 'UPDATE':
                // Check if tracker list is present
                if (payload.data) {
                    return {
                        trackers: payload.data,
                        loading: false,
                        error: null
                    }
                }
                // Setup error
                return {
                    trackers: [],
                    loading: false,
                    error: 'Update error: payload.data is undefined'
                }
            case 'LOADING':
                return {
                    ...state,
                    loading: true,
                    error: null
                }
            case 'ERROR':
                return {
                    trackers: [],
                    loading: false,
                    error: payload.error || 'General error'
                }
            default:
                return state;
        }
    }, {
        trackers: [],
        loading: true,
        error: null
    });

    // Load trackers
    const loadTrackerList = async () => {
        // Loading
        dispatch({type: 'LOADING'});
        // Request
        try {
            // Query trackers
            const trackers = await DataStore.query(Tracker);
            // Update list
            dispatch({type: 'UPDATE', data: trackers});
        } catch (e) {
            console.error('loadTrackerList', {e});
            // Feedback
            dispatch({type: 'ERROR', error: 'Error loading trackers'});
        }
    }

    // Initial load
    useEffect(() => {
        // Wait DataStore
        DataStore.start().then(() => {
            // Load trackers
            loadTrackerList().then(() => true);
        });
    }, []);

    useEffect(() => {
        // Live update
        /*DataStore.observeQuery(Tracker).subscribe(snapshot => {
            // Update list
            dispatch({type: 'UPDATE', data: snapshot.items});
        });*/
    }, []);

    /**
     * Add tracker
     * @param logServiceObject
     */
    const addTracker = async (logServiceObject?: any) => {
        try {
            await DataStore.save(
                new Tracker({
                    title: 'Ontime Tracker',
                    state: TrackerState.STOP,
                    logServiceObject
                })
            )
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Tracker creato',
                    type: 'success'
                })
            )
            // Update list
            loadTrackerList().then();
        } catch (e) {
            console.error(e);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Errore richiesta',
                    content: 'Spiacenti, si ?? verificato un errure durante la creazione del Tracker<br />Si prega di riprovare',
                    type: 'error'
                })
            )
        }
    }

    /**
     * Before tracker start
     * Check user settings and operate on trackers.
     *
     * Settings:
     * - stop trackers on tracker start
     */
    const startTracker = async (tracker: Tracker) => {
        // Check if there are trackers running
        const runningTrackers = await DataStore.query(Tracker, t => t.state('eq', "START"));
        // Each tracker
        for (const runningTracker of runningTrackers) {
            // Pause current tracker
            await onTrackerFinish(runningTracker, true, false);
        }
        // Update this tracker with START
        await updateTracker({
            ...tracker,
            state: TrackerState.START,
            startedAt: tracker.startedAt || moment().utc().toISOString()
        });
        // Refresh list
        loadTrackerList().then(() => true);
    }

    /**
     * Update tracker
     * @param tracker
     */
    const updateTracker = async (tracker: Tracker) => {
        try {
            // Get record
            const original = await DataStore.query(Tracker, tracker.id);
            if (!original) {
                // Feedback
                storeDispatch(
                    showFeedback({
                        title: 'Error update tracker',
                        content: 'Attenzione, record non trovato',
                        type: 'warning'
                    })
                );
            } else {
                // Update record
                await DataStore.save(
                    Tracker.copyOf(original, updated => {
                        updated.title = tracker.title;
                        updated.logDescription = tracker.logDescription;
                        updated.startedAt = tracker.startedAt;
                        updated.title = tracker.title;
                        updated.state = tracker.state;
                        updated.ttid = tracker.ttid;
                    })
                );
            }
        } catch (e) {
            console.error(e);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Error update tracker',
                    content: 'Spiacemti, si ?? verificato un errore durante il salvataggio',
                    type: 'danger'
                })
            );
        }
    }

    /**
     * Tracker finished
     * Update the tracker data and create a new WorkLog
     * @param tracker
     * @param isPause
     * @param refresh
     */
    const onTrackerFinish = async (tracker: Tracker, isPause = false, refresh = true) => {
        try {
            const ttid = uuidV4();
            // Create new log
            await DataStore.save(
                new WorkLog({
                    title: tracker.title,
                    description: tracker.logDescription,
                    startedAt: tracker.startedAt || moment().utc().toISOString(),
                    endedAt: moment().utc().toISOString(),
                    ttid: tracker.ttid || ttid,
                    logServiceObject: tracker.logServiceObject,
                    state: WorkLogState.PENDING
                })
            )
            // Check if isPause
            if (isPause) {
                // Update this tracker with PAUSE
                await updateTracker({
                    ...tracker,
                    ttid: tracker.ttid || ttid,
                    state: TrackerState.PAUSE,
                    startedAt: null
                });
            } else {
                // Update this tracker with STOP
                await updateTracker({
                    ...tracker,
                    logDescription: null,
                    ttid: null,
                    state: TrackerState.STOP,
                    startedAt: null
                });
            }
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Tracker Finished',
                    content: 'New WorkLog created',
                    type: 'success'
                })
            )
            // Refresh list
            if (refresh) {
                loadTrackerList().then(() => true);
            }
        } catch (e) {
            console.error(e);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Error update tracker',
                    content: 'Spiacemti, si ?? verificato un errore durante il salvataggio',
                    type: 'danger'
                })
            );
        }
    }

    /**
     * Delete tracker
     * @param tracker
     */
    const deleteTracker = async (tracker: Tracker) => {
        try {
            await DataStore.delete(tracker);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Tracker rimosso',
                    type: 'success'
                })
            )
            // Update list
            loadTrackerList().then();
        } catch (e) {
            console.error('deleteTracker', {e});
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Errore richiesta',
                    content: 'Spiacenti, si ?? verificato un errure durante l\'eliminazione del Tracker<br />Si prega di riprovare',
                    type: 'error'
                })
            )
        }
    }

    // Check error
    if (error) {
        return (
            <Error
                title={error}
                enableRetry={true}
                onRetry={() => loadTrackerList()}
            />
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2.5">
            {
                // Each tracker
                trackers.map(tracker => (
                    <TrackerTimer
                        key={tracker.id}
                        tracker={tracker}
                        onStart={startTracker}
                        onUpdate={updateTracker}
                        onFinish={onTrackerFinish}
                        onDelete={deleteTracker}
                    />
                ))
            }
            {/* Loading */}
            {loading ? <SkeletonComponent shape='Rectangle' width='100%' height='100%'/> : <></>}
            {/* Add Tracker */}
            <AddTracker onDefaultTracker={() => addTracker()} onNormalTracker={() => addTracker()}/>
        </div>
    )
}