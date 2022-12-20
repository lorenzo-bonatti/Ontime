import React, {ReactElement, useRef} from "react";
import {Tracker, TrackerState} from "@models/index";
import {CommandColumn, Edit, GridColumn, GridComponent, Toolbar} from "@syncfusion/ej2-react-grids";
import {Inject} from "@syncfusion/ej2-react-treegrid";
import {TextBox} from "@syncfusion/ej2-react-inputs";
import moment from "moment";
import {TrackerDuration} from "@components/tracker-duration";

interface Props {
    trackers: Tracker[]
    onAddTracker: () => Promise<void>
    onStartTracker: (tracker: Tracker) => Promise<void>
    onUpdateTracker: (tracker: Tracker) => Promise<void>
    onFinishTracker: (tracker: Tracker, isPause?: boolean) => Promise<void>
    onDeleteTracker: (tracker: Tracker) => Promise<void>
}

export const TrackersGridView = (
    {
        trackers,
        onAddTracker,
        onStartTracker,
        onUpdateTracker,
        onFinishTracker,
        onDeleteTracker
    }: Props): ReactElement => {

    // Reference
    const grid = useRef<GridComponent | null>(null);
    const logEditor = useRef<TextBox | null>(null);
    const logEditorContainer = useRef<HTMLTextAreaElement | null>(null);

    return (
        <GridComponent
            ref={grid}
            // Layout
            height='100%'
            rowHeight={50}
            gridLines='Both'
            // Data source
            dataSource={trackers}
            columns={[
                {field: 'id', isPrimaryKey: true, visible: false},
                {field: 'title', headerText: 'Title'},
                {
                    field: 'logDescription',
                    headerText: 'Log Description',
                    edit: {
                        create: () => {
                            // Create HTML container
                            logEditorContainer.current = document.createElement('textarea');
                            return logEditorContainer.current;
                        },
                        destroy: () => {
                            // Destroy editor
                            logEditor.current?.destroy();
                        },
                        read: () => {
                            // Get editor value
                            return logEditor.current?.value || null;
                        },
                        write: (args: any) => {
                            // Create text editor
                            logEditor.current = new TextBox({
                                placeholder: 'Insert log description',
                                floatLabelType: 'Auto',
                                value: args.rowData.logDescription,
                                multiline: true,
                                htmlAttributes: {
                                    rows: '2'
                                }
                            });
                            // Append to HTML element
                            const _container = logEditorContainer.current;
                            if (_container) logEditor.current?.appendTo(_container);
                        }
                    },
                    template: ((args: Tracker) => args.logDescription || '--') as any
                },
                {
                    field: 'startedAt',
                    headerText: 'Start at',
                    type: 'datetime',
                    editType: 'datetimepickeredit',
                    format: {type: 'dateTime', skeleton: 'medium'},
                },
                {
                    field: 'duration',
                    allowEditing: false,
                    headerText: 'Duration',
                    template: ((args: Tracker) => TrackerDuration(args)) as any
                },
                {
                    headerText: 'Actions',
                    commands: [
                        {
                            title: 'Start',
                            buttonOption: {
                                iconCss: 'fa-solid fa-play',
                                isPrimary: true,
                                cssClass: 'e-flat start-command'
                            }
                        },
                        {
                            title: 'Resume',
                            buttonOption: {
                                iconCss: 'fa-solid fa-play',
                                isPrimary: true,
                                cssClass: 'e-flat resume-command'
                            }
                        },
                        {
                            title: 'Finish',
                            buttonOption: {
                                iconCss: 'fa-solid fa-flag-checkered',
                                isPrimary: true,
                                cssClass: 'e-flat finish-command'
                            }
                        },
                        {
                            title: 'Pause',
                            buttonOption: {
                                iconCss: 'fa-solid fa-pause',
                                cssClass: 'e-flat pause-command'
                            }
                        },
                        {
                            type: 'Edit',
                            buttonOption: {
                                iconCss: 'fa-solid fa-pen-to-square',
                                cssClass: 'e-flat'
                            }
                        },
                        {
                            type: 'Delete',
                            buttonOption: {
                                iconCss: 'fa-solid fa-trash',
                                cssClass: 'e-flat'
                            }
                        }
                    ]
                }
            ]}
            // Toolbar
            toolbar={[
                {
                    text: 'Add Tracker',
                    prefixIcon: 'fa-solid fa-plus',
                    click: () => onAddTracker()
                }
            ]}
            // Edit
            editSettings={{
                allowEditing: true,
                allowDeleting: true,
                showDeleteConfirmDialog: true,
                mode: 'Dialog'
            }}
            // Actions
            commandClick={(args: any) => {
                // Check command type
                if (args.commandColumn?.title === 'Start' || args.commandColumn?.title === 'Resume') {
                    // Callback start
                    onStartTracker(args.rowData as Tracker)
                } else if (args.commandColumn?.title === 'Pause') {
                    // Callback resume
                    onFinishTracker(args.rowData as Tracker, true)
                } else if (args.commandColumn?.title === 'Finish') {
                    // Check current status
                    if (args.rowData.state === TrackerState.PAUSE) {
                        // Update tracker with reset
                        onUpdateTracker({
                            ...args.rowData as Tracker,
                            logDescription: null,
                            startedAt: null,
                            ttid: null,
                            state: TrackerState.STOP
                        });
                    } else {
                        // Callback finish
                        onFinishTracker(args.rowData as Tracker)
                    }
                }
            }}
            queryCellInfo={(args: any) => {
                // Check if is a command column
                if (args.cell.classList.contains('e-unboundcell')) {
                    // Check state of tracker
                    const tracker: Tracker = args.data;
                    if (tracker.state === TrackerState.START) {
                        // Hide start, resume commands
                        args.cell.querySelector('.start-command').classList.add('hidden');
                        args.cell.querySelector('.resume-command').classList.add('hidden');
                        // Show finish, pause commands
                        args.cell.querySelector('.finish-command').classList.remove('hidden');
                        args.cell.querySelector('.pause-command').classList.remove('hidden');
                    } else if (tracker.state === TrackerState.PAUSE) {
                        // Hide start, pause commands
                        args.cell.querySelector('.start-command').classList.add('hidden');
                        args.cell.querySelector('.pause-command').classList.add('hidden');
                        // Show finish, resume commands
                        args.cell.querySelector('.finish-command').classList.remove('hidden');
                        args.cell.querySelector('.resume-command').classList.remove('hidden');
                    } else if (tracker.state === TrackerState.STOP) {
                        // Hide finish, pause, resume commands
                        args.cell.querySelector('.finish-command').classList.add('hidden');
                        args.cell.querySelector('.pause-command').classList.add('hidden');
                        args.cell.querySelector('.resume-command').classList.add('hidden');
                        // Show start command
                        args.cell.querySelector('.start-command').classList.remove('hidden');
                    }
                }
            }}
            // Listeners
            actionBegin={(args: any) => {
                // Check if start editing
                if (args.requestType === 'beginEdit') {
                    // Hide duration column
                    (grid.current!.columns[4] as GridColumn).visible = false;
                } else if (args.requestType === 'save') {
                    // Cancel data
                    args.cancel = true;
                    // Format data
                    const data: Tracker = {
                        ...args.data,
                        startedAt: args.data.startedAt ? moment(args.data.startedAt).utc().toISOString(true) : null,
                    }
                    // Callback update
                    onUpdateTracker(data).then(() => {
                        // Enable duration column
                        (grid.current!.columns[4] as GridColumn).visible = true;
                        // Hide dialog
                        args.dialog.hide();
                    });
                } else if (args.requestType === 'delete') {
                    // Callback delete
                    onDeleteTracker(args.data[0] as Tracker);
                }
            }}
        >
            <Inject services={[Toolbar, Edit, CommandColumn]}/>
        </GridComponent>
    )
}