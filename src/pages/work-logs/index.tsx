import React, {ReactElement, Reducer, useEffect, useReducer} from "react";
import {WorkLogGrid} from "@components/work-log-grid";
import {WorkLog, WorkLogState} from '@models/index';
import {SkeletonComponent} from "@syncfusion/ej2-react-notifications";
import {DataStore, SortDirection} from "aws-amplify";
import {showFeedback} from "../../store/feedback";
import {useStoreDispatch} from "../../store";
import moment, {Moment} from "moment/moment";
import {Error} from "@pages/error";
import _ from 'lodash';

type WorkLogParent = WorkLog & {
    children: WorkLog[]
}

const formatWorkLogs = (items: WorkLog[]): (WorkLog | WorkLogParent)[] => {
    let workLogs: (WorkLog | WorkLogParent)[] = [];
    // Group work logs by ttid
    const group = _.groupBy(items, 'ttid');
    for (const ttid in group) {
        // Check if there are many work logs
        if (group[ttid].length > 1) {
            // Get parent with merged
            const parent: WorkLogParent = {
                ...getMergeLogs(group[ttid]),
                children: group[ttid]
            }
            // Append to list
            workLogs = [...workLogs, parent];
        } else {
            // Append to list
            workLogs = [...workLogs, ...group[ttid]];
        }
    }
    // Return work log list
    return workLogs;
}

/**
 * Merge Logs
 *
 * Questa funzione ha il compito di mergiare una lista di logs
 * in uno unico più grande che va a comprendere tutti il tempo impiegato da essi.
 * Il totale delle ore per il log risultante sarà la somma delle differenze
 * tra l'inizio e la fine di ogni singolo log figlio.
 *
 * Esempio:
 * Log 1: dalle 14:30 alle 15:30 (+60m)
 * Log 2: dalle 16:55 alle 17:10 (+15m)
 * Log 3: dalle 17:40 alle 18:05 (+25m)
 * Log merged: dalle 14:30 alle 16:10 (1h 40m)
 *
 * La descrizione dei log saranno concatenate.
 * Il titolo ed eventuali parametri come il link al task,
 * verranno presi dall'ultimo record registrato (per logica il piu aggiornato).
 */
export const getMergeLogs = (items: WorkLog[]): WorkLog => {
    let startedAt: Moment | null = null;
    let description = '';
    // Minutes diff
    let diff = 0;
    // Each child
    for (const child of items) {
        if (!startedAt) startedAt = moment(child.startedAt);
        // Update start end diff
        diff += moment(child.endedAt).diff(child.startedAt, 'minutes');
        // Add log description
        description += (description ? (description.slice(-1) === '.' ? ' ' : '. ') : '') + child.description;
    }
    // Calculate endAt
    const endedAt = moment(startedAt)?.add(diff, 'minutes') || null;
    // Get merged log
    return {
        // Last child as parent
        ...items[items.length - 1],
        description,
        startedAt: startedAt?.toISOString(true) || moment().utc().toISOString(true),
        endedAt: endedAt?.toISOString(true) || moment().utc().toISOString(true)
    };
}

export const WorkLogs = (): ReactElement => {

    // Redux
    const storeDispatch = useStoreDispatch();

    // Type reducer
    interface ReducerData {
        workLogs: (WorkLog | WorkLogParent)[]
        loading: boolean
        error: string | null
    }

    interface ReducerPayload {
        action: 'UPDATE' | 'LOADING' | 'ERROR'
        data?: WorkLog[]
        error?: string
    }

    // Setup WorkLog reducer
    const [{
        workLogs,
        loading,
        error
    }, dispatch] = useReducer<Reducer<ReducerData, ReducerPayload>>((state, payload) => {
        switch (payload.action) {
            case "UPDATE":
                // Check if data is defined
                if (payload.data) {
                    return {
                        workLogs: formatWorkLogs(payload.data),
                        loading: false,
                        error: null
                    };
                }
                // Error
                return {
                    workLogs: [],
                    loading: false,
                    error: 'Update error: payload.data is undefined'
                };
            case "LOADING":
                return {
                    ...state,
                    loading: true,
                    error: null
                };
            case "ERROR":
                return {
                    workLogs: [],
                    loading: false,
                    error: payload.error || 'General error'
                };
            default:
                return state;
        }
    }, {
        workLogs: [],
        loading: true,
        error: null
    });

    // Init data
    useEffect(() => {
        // Observe work logs
        DataStore.observeQuery(WorkLog, wl => wl.state('eq', WorkLogState.PENDING), {
            sort: wl => wl.startedAt(SortDirection.ASCENDING)
        }).subscribe(snapshot => {
            // Update list
            dispatch({action: "UPDATE", data: snapshot.items});
        });
    }, []);

    /**
     * Log
     * Update the workLog state to LOGGED
     * @param workLog
     */
    const log = async (workLog: WorkLog) => {
        try {
            // Update Work Log state with LOGGED
            await update({...workLog, state: WorkLogState.LOGGED});
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'WorkLog Logged',
                    type: 'success'
                })
            );
        } catch (e) {
            console.error(e);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Error update WorkLog',
                    content: 'Spiacemti, si è verificato un errore durante il salvataggio',
                    type: 'danger'
                })
            );
        }
    }

    /**
     * Update record
     */
    const update = async (workLog: WorkLog) => {
        try {
            // Get record
            const original = await DataStore.query(WorkLog, workLog.id);
            if (!original) {
                // Feedback
                storeDispatch(
                    showFeedback({
                        title: 'Error update work log',
                        content: 'Attenzione, record non trovato',
                        type: 'warning'
                    })
                );
            } else {
                // Update record
                await DataStore.save(
                    WorkLog.copyOf(original, updated => {
                        updated.title = workLog.title;
                        updated.description = workLog.description;
                        updated.startedAt = workLog.startedAt;
                        updated.endedAt = workLog.endedAt;
                        updated.ttid = workLog.ttid;
                        updated.logServiceObject = workLog.logServiceObject;
                        updated.state = workLog.state;
                    })
                );
            }
        } catch (e) {
            console.error(e);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Error update WorkLog',
                    content: 'Spiacemti, si è verificato un errore durante il salvataggio',
                    type: 'danger'
                })
            );
        }
    }

    /**
     * Merge WorkLog
     * Create a new work log with the passed work log
     * and delete (setup MERGED) all related workLog from TTID.
     * @param workLog
     * @param ttid
     */
    const merge = async (workLog: WorkLog, ttid: string) => {
        try {
            const requests = [];
            // Create new work log
            await DataStore.save(
                new WorkLog({
                    title: workLog.title,
                    description: workLog.description,
                    startedAt: workLog.startedAt,
                    endedAt: workLog.endedAt,
                    ttid: workLog.ttid,
                    logServiceObject: workLog.logServiceObject,
                    state: WorkLogState.PENDING,
                })
            )
            // Get all record
            const items = await DataStore.query(WorkLog, wl => wl.ttid('eq', ttid));
            for (const item of items) {
                // Update state
                requests.push(
                    DataStore.save(
                        WorkLog.copyOf(item, updated => {
                            updated.state = WorkLogState.MERGED;
                        })
                    )
                )
            }
            // Await all
            await Promise.all(requests);
        } catch (e) {
            console.error(e);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Error update WorkLog',
                    content: 'Spiacemti, si è verificato un errore durante il salvataggio',
                    type: 'danger'
                })
            );
        }
    }

    /**
     * Update work log state to DELETED
     */
    const softDelete = async (workLog: WorkLog) => {
        try {
            // Update Work Log state with DELETED
            await update({...workLog, state: WorkLogState.DELETED});
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'WorkLog Rimosso',
                    type: 'danger'
                })
            );
        } catch (e) {
            console.error(e);
            // Feedback
            storeDispatch(
                showFeedback({
                    title: 'Error delete WorkLog',
                    content: 'Spiacemti, si è verificato un errore durante il salvataggio',
                    type: 'danger'
                })
            );
        }
    }

    // Check error
    if (error) {
        return (
            <Error title={error}/>
        )
    }

    return (
        <div>
            {/* Grid */}
            {
                loading
                    ? <SkeletonComponent height='100%'/>
                    : <WorkLogGrid
                        workLogs={workLogs}
                        onUpdate={update}
                        onLog={log}
                        onMerge={merge}
                        onDelete={softDelete}
                    />
            }
        </div>
    )
}