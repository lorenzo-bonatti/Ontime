import React, {ReactElement, useRef} from 'react';
import {closest} from '@syncfusion/ej2-base';
import {TextBox} from '@syncfusion/ej2-react-inputs';
import {TreeGridComponent} from '@syncfusion/ej2-react-treegrid';
import {Inject, Page, Sort, Edit, Toolbar, CommandColumn} from '@syncfusion/ej2-react-treegrid';
import {WorkLog} from '@models/index';
import moment from "moment";
import {DialogUtility} from "@syncfusion/ej2-popups";

interface WorkLogGridProps {
    /**
     * Work log list
     */
    workLogs: WorkLog[]
    /**
     * On update record
     */
    onUpdate: (workLog: WorkLog) => Promise<void>
    /**
     * Log record
     */
    onLog: (workLog: WorkLog) => Promise<void>
    /**
     * Merge WorkLogs
     */
    onMerge: (workLog: WorkLog, ttid: string) => Promise<void>
    /**
     * On delete
     */
    onDelete: (workLog: WorkLog) => Promise<void>
}

export const WorkLogGrid = ({workLogs, onUpdate, onLog, onMerge, onDelete}: WorkLogGridProps): ReactElement => {

    // Reference
    const treeGrid = useRef<TreeGridComponent | null>(null);
    const logEditor = useRef<TextBox | null>(null);
    const logEditorContainer = useRef<HTMLTextAreaElement | null>(null);

    // Get row data
    const getGridRowData = (args: any): any => (
        treeGrid.current?.grid.getRowObjectFromUID(
            closest(args.target, '.e-row').getAttribute('data-uid') as string
        )?.data
    );

    const log = async (args: WorkLog & unknown) => {
        try {
            // Callback update
            await onLog(args);
        } catch (e) {
            console.error(e);
        }
    }

    const merge = async (args: WorkLog & unknown) => {
        // Show confirm dialog
        const dialog = DialogUtility.confirm({
            title: 'Merge WorkLog',
            content: 'Sei sicuro/a di voler continuare?',
            okButton: {
                text: 'Merge',
                icon: 'fa-solid fa-code-merge',
                click: () => {
                    try {
                        if (!args.ttid) return;
                        // Merge work log
                        onMerge(args, args.ttid).then(() => {
                            // Hide dialog
                            dialog.hide();
                        });
                    } catch (e) {
                        console.error(e);
                    }
                }
            },
            cancelButton: {
                text: 'Annulla'
            }
        });
    }

    /**
     * Update WorkLog
     * Callback function for update the workLog
     * @param args
     */
    const update = async (args: WorkLog & unknown) => {
        try {
            // Callback update
            await onUpdate({
                ...args,
                startedAt: moment(args.startedAt).utc().toISOString(true),
                endedAt: moment(args.endedAt).utc().toISOString(true)
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Delete work log
     * Callback function for soft delete the work log
     * (change status to DELETED)
     * @param args
     */
    const deleteWorkLog = async (args: WorkLog & unknown) => {
        try {
            // Callback update
            await onDelete(args);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <TreeGridComponent
            ref={treeGrid}
            // Layout
            height='100%'
            rowHeight={50}
            gridLines='Both'
            // Data source
            dataSource={workLogs}
            columns={[
                {
                    field: 'title',
                    headerText: 'Title',
                    width: '250',
                    validationRules: {required: true}
                },
                {
                    field: 'description',
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
                                value: args.rowData.description,
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
                    template: ((args: any) => args.description || '--') as any
                },
                {
                    field: 'startedAt',
                    headerText: 'Start at',
                    width: '250',
                    type: 'datetime',
                    editType: 'datetimepickeredit',
                    format: {type: 'dateTime', skeleton: 'medium'},
                    validationRules: {required: true}
                },
                {
                    field: 'endedAt',
                    headerText: 'End At',
                    width: '250',
                    type: 'datetime',
                    editType: 'datetimepickeredit',
                    format: {type: 'dateTime', skeleton: 'medium'},
                    validationRules: {required: true}
                },
                {
                    headerText: 'Time',
                    width: '150',
                    allowEditing: false,
                    template: ((args: WorkLog) => {
                        // Get diff
                        const diff = moment(args.endedAt).diff(args.startedAt);
                        return moment.utc(diff).format('HH:mm');
                    }) as any
                },
                {
                    headerText: 'Commands',
                    width: '200',
                    commands: [
                        {
                            title: 'Merge',
                            buttonOption: {
                                iconCss: 'fa-solid fa-code-merge',
                                cssClass: 'e-flat custom-command parent-command',
                                isPrimary: true,
                                click: (args: any) => {
                                    const rowData: WorkLog & unknown = getGridRowData(args);
                                    // Merge work logs
                                    merge(rowData).then(() => true);
                                }
                            }
                        },
                        {
                            title: 'Log',
                            buttonOption: {
                                iconCss: 'fa-regular fa-square-check',
                                cssClass: 'e-flat custom-command child-command',
                                isPrimary: true,
                                click: (args: any) => {
                                    const rowData: WorkLog & any | undefined = getGridRowData(args);
                                    if (rowData) {
                                        // Log this work log
                                        log(rowData).then(() => true);
                                    }
                                }
                            }
                        },
                        {
                            type: 'Edit',
                            buttonOption: {
                                iconCss: 'fa-solid fa-pen-to-square',
                                cssClass: 'e-flat custom-command child-command'
                            }
                        },
                        {
                            type: 'Save',
                            buttonOption: {
                                cssClass: 'e-flat',
                                iconCss: 'e-update e-icons',
                                isPrimary: true
                            }
                        },
                        {
                            type: 'Cancel',
                            buttonOption: {
                                cssClass: 'e-flat',
                                iconCss: 'e-cancel-icon e-icons'
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
            allowTextWrap={false}
            // Tree settings
            treeColumnIndex={0}
            childMapping='children'
            enableCollapseAll={true}
            // Cell info for parent and children elements
            queryCellInfo={(args: any) => {
                // Check if is a command column
                if (args.cell.classList.contains('e-unboundcell')) {
                    // Enable / Disable child elements
                    for (const element of args.cell.getElementsByClassName('child-command')) {
                        element.style.display = !args.data.childRecords?.length ? 'inlinde-block' : 'none';
                    }
                    // Enable / Disable parent elements
                    for (const element of args.cell.getElementsByClassName('parent-command')) {
                        element.style.display = args.data.childRecords?.length ? 'inlinde-block' : 'none';
                    }
                }
            }}
            // Paging
            allowPaging={true}
            pageSettings={{
                pageSize: 25,
                pageCount: 5
            }}
            // Sorting
            allowSorting={true}
            // Editing
            editSettings={{
                allowEditing: true,
                allowDeleting: true,
                mode: 'Dialog' as any,
                showDeleteConfirmDialog: true
            }}
            // Command click

            // Actions
            actionBegin={(args: any) => {
                // Args
                if (args.requestType === 'beginEdit') {
                    // Check if parent edit
                    if (args.rowData.children?.length) {
                        args.cancel = true;
                    } else {
                        // Hide other commands
                        for (const element of args.row.getElementsByClassName('custom-command')) {
                            element.style.display = 'none';
                        }
                    }
                } else if (args.requestType === 'save') {
                    // Cancel default grid operation
                    args.cancel = true;
                    // Update Work Log
                    update(args.data).then(() => true);
                } else if (args.requestType === 'delete') {
                    // Cancel default grid operation
                    args.cancel = true;
                    // Delete Work Log
                    deleteWorkLog(args.data[0]).then(() => true);
                }
            }}
        >
            <Inject services={[Edit, Page, Sort, Toolbar, CommandColumn]}/>
        </TreeGridComponent>
    );
};