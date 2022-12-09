import {Tracker, TrackerState, WorkLog, WorkLogState} from "@models/index";
import {Error} from "@pages/error";
import {DataStore} from 'aws-amplify';
import React, {ReactElement, Reducer, useEffect, useReducer, useState} from "react";
import {useStoreDispatch} from "../../store";
import {showFeedback} from "../../store/feedback";
import moment from "moment";
import {v4 as uuidV4} from 'uuid';
import {AppBarComponent} from "@syncfusion/ej2-react-navigations";
import {delayCallback} from "../../utils";
import {TrackersCardView} from "@components/trackers-card-view";
import {SkeletonComponent} from "@syncfusion/ej2-react-notifications";

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

    // States
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        // Setup loading
        dispatch({type: 'LOADING'});
        // Observer trackers
        const obs = DataStore.observeQuery(Tracker, t => (
            t.or(t => t.title('contains', filter))
        )).subscribe(snapshot => {
            // Check if isSynced
            if (snapshot.isSynced) {
                // Update list
                dispatch({type: 'UPDATE', data: snapshot.items});
            }
        });
        // On exit
        return () => {
            // Unsubscribe observer
            obs.unsubscribe();
        }
    }, [filter]);

    const onFilter = (text: string) => {
        // Delay action
        delayCallback(() => {
            // Setup filters
            setFilter(text);
        })
    }

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
        } catch (e) {
            console.error(e);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Errore richiesta',
                    content: 'Spiacenti, si è verificato un errure durante la creazione del Tracker<br />Si prega di riprovare',
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
            await finishTracker(runningTracker, true);
        }
        // Update this tracker with START
        await updateTracker({
            ...tracker,
            state: TrackerState.START,
            startedAt: tracker.startedAt || moment().utc().toISOString()
        });
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
                    content: 'Spiacemti, si è verificato un errore durante il salvataggio',
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
     */
    const finishTracker = async (tracker: Tracker, isPause = false) => {
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
        } catch (e) {
            console.error(e);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Error update tracker',
                    content: 'Spiacemti, si è verificato un errore durante il salvataggio',
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
        } catch (e) {
            console.error('deleteTracker', {e});
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Errore richiesta',
                    content: 'Spiacenti, si è verificato un errure durante l\'eliminazione del Tracker<br />Si prega di riprovare',
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
            />
        )
    }

    return (
        <div className='page'>
            {/* AppBar - Title */}
            <AppBarComponent cssClass='page-bar'>
                <h1 className="page-title"><i className="fa-solid fa-stopwatch"/> Trackers</h1>
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
                        <span className="e-input-group-icon fa-solid fa-search"/>
                    </div>
                    {/* Switch layout view */}
                    <div className="e-btn-group">
                        {/* Card */}
                        <input type="radio" id="trackers-card-layout" name="trackers-layout"/>
                        <label className="e-btn e-outline e-primary" htmlFor="trackers-card-layout">
                            <i className="fa-solid fa-table-columns"/>
                        </label>
                        {/* Grid */}
                        <input type="radio" id="trackers-grid-layout" name="trackers-layout"/>
                        <label className="e-btn e-outline e-primary" htmlFor="trackers-grid-layout">
                            <i className="fa-solid fa-table-list"/>
                        </label>
                    </div>
                </div>
            </AppBarComponent>
            {/* Trackers */}
            {
                loading
                    ? <SkeletonComponent width='100%' height='350px'/>
                    : <TrackersCardView
                        trackers={trackers}
                        onAddTracker={addTracker}
                        onStartTracker={startTracker}
                        onUpdateTracker={updateTracker}
                        onFinishTracker={finishTracker}
                        onDeleteTracker={deleteTracker}
                    />
            }
        </div>
    )
}