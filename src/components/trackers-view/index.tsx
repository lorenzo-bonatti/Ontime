import { Tracker, TrackerState, TrackerViewModes, TrackerViewSort, UserSetting, WorkLog, WorkLogState } from "@models/index";
import { Error } from "@pages/error";
import { DataStore, SortDirection } from 'aws-amplify';
import React, { ReactElement, Reducer, useEffect, useMemo, useReducer, useState } from "react";
import { useStoreDispatch } from "../../store";
import { showFeedback } from "../../store/feedback";
import moment from "moment";
import { v4 as uuidV4 } from 'uuid';
import { SkeletonComponent } from "@syncfusion/ej2-react-notifications";
import { TrackersCardView } from "@components/trackers-card-view";
import { TrackersGridView } from "@components/trackers-grid-view";
import _ from "lodash";

interface TrackerViewProps {
    predicates?: any,
    limit?: number,
    userSetting?: UserSetting
}

export const TrackersView = ({ predicates, limit, userSetting }: TrackerViewProps): ReactElement => {

    // Store
    const storeDispatch = useStoreDispatch();

    // Reducer types
    interface ReducerData {
        trackers: Tracker[]
        loading: boolean
        error: string | null
    }

    interface ReducerPayload {
        action: string
        trackers?: {
            items: Tracker[]
            isSynced: boolean
        }
        error?: string
    }

    // Setup reducer
    const [{
        trackers,
        loading,
        error
    }, dispatch] = useReducer<Reducer<ReducerData, ReducerPayload>>((state, payload) => {
        switch (payload.action) {
            case 'UPDATE':
                // Update data
                return {
                    trackers: payload.trackers?.items || state.trackers,
                    loading: !payload.trackers?.isSynced,
                    error: null
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

    /**
     * Observe trackers
     */
    useEffect(() => {
        // Setup loading
        dispatch({ action: 'LOADING' });
        // Observer trackers
        const obs = DataStore.observeQuery(
            Tracker,
            predicates,
            {
                sort: t => {
                    // Check user setting
                    if (userSetting?.trackerViewSort === TrackerViewSort.UPDATED_AT) {
                        // Sort by updated at
                        return t.updatedAt(SortDirection.DESCENDING);
                    } else {
                        // Default sort
                        return t.createdAt(SortDirection.ASCENDING);
                    }
                }
            }
            //t => t.or(t => t.title('contains', search))
        ).subscribe(snapshot => {
            const data = snapshot;
            let items;            
            // Check limit and user setting
            if (limit && userSetting?.trackerViewSort === TrackerViewSort.UPDATED_AT) {
                // Slice array data
                items = _.slice(data.items, 0, limit);
            } else if (limit) {
                // Get last items
                items = _.slice(data.items, data.items.length > limit ? data.items.length - limit : 0, data.items.length);
            }
            // Update list
            dispatch({
                action: 'UPDATE',
                trackers: { ...data, items: items || data.items }
            });
        });
        // On exit
        return () => {
            // Unsubscribe observer
            obs.unsubscribe();
        }
    }, [predicates, userSetting?.trackerViewSort, limit]);

    /**
     * Add tracker
     * @param logServiceObject
     */
    const addTracker = async (logServiceObject?: any) => {
        try {
            // Create new tracker
            await DataStore.save(
                new Tracker({
                    title: 'Ontime Tracker',
                    state: TrackerState.STOP,
                    logServiceObject
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
            console.error('deleteTracker', { e });
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

    /**
     * View trackers
     */
    const TrackerViewMemo = useMemo(() => {
        // Get user setting
        const viewMode = userSetting?.trackerViewMode;
        // Get current view
        if (!viewMode || viewMode === TrackerViewModes.CARD) {
            return (
                <TrackersCardView
                    trackers={trackers}
                    onAddTracker={addTracker}
                    onStartTracker={startTracker}
                    onUpdateTracker={updateTracker}
                    onFinishTracker={finishTracker}
                    onDeleteTracker={deleteTracker}
                />
            )
        } else if (viewMode === TrackerViewModes.GRID) {
            return (
                <TrackersGridView
                    trackers={trackers}
                    onAddTracker={addTracker}
                    onStartTracker={startTracker}
                    onUpdateTracker={updateTracker}
                    onFinishTracker={finishTracker}
                    onDeleteTracker={deleteTracker}
                />
            )
        }
        // No view
        return (
            <Error
                title='View not found'
                description='Sorry, this view not working on this version'
            />
        )
    }, [trackers, userSetting])

    return (
        <>
            {/* Trackers */}
            {
                loading
                    ? <SkeletonComponent width='100%' height='350px' />
                    : TrackerViewMemo
            }
        </>
    )
}