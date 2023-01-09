export const schema = {
    "models": {
        "UserSetting": {
            "name": "UserSetting",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "language": {
                    "name": "language",
                    "isArray": false,
                    "type": {
                        "enum": "Languages"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "trackerAutoStart": {
                    "name": "trackerAutoStart",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "trackerStopOnNewStart": {
                    "name": "trackerStopOnNewStart",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "trackerViewMode": {
                    "name": "trackerViewMode",
                    "isArray": false,
                    "type": {
                        "enum": "TrackerViewModes"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "trackerViewSort": {
                    "name": "trackerViewSort",
                    "isArray": false,
                    "type": {
                        "enum": "TrackerViewSort"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "dashboardTrackersPagination": {
                    "name": "dashboardTrackersPagination",
                    "isArray": false,
                    "type": {
                        "enum": "DashboardTrackersPagination"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "UserSettings",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "identityClaim": "cognito:username",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "WorkLog": {
            "name": "WorkLog",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "title": {
                    "name": "title",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "startedAt": {
                    "name": "startedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": true,
                    "attributes": []
                },
                "endedAt": {
                    "name": "endedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": true,
                    "attributes": []
                },
                "ttid": {
                    "name": "ttid",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "logServiceObject": {
                    "name": "logServiceObject",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": {
                        "enum": "WorkLogState"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "WorkLogs",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "identityClaim": "cognito:username",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Tracker": {
            "name": "Tracker",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "title": {
                    "name": "title",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "logDescription": {
                    "name": "logDescription",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "startedAt": {
                    "name": "startedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": {
                        "enum": "TrackerState"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "ttid": {
                    "name": "ttid",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "logServiceObject": {
                    "name": "logServiceObject",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "favorite": {
                    "name": "favorite",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Trackers",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "identityClaim": "cognito:username",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "DashboardTrackersPagination": {
            "name": "DashboardTrackersPagination",
            "values": [
                "THREE",
                "SEVEN"
            ]
        },
        "TrackerViewSort": {
            "name": "TrackerViewSort",
            "values": [
                "CREATED_AT",
                "UPDATED_AT"
            ]
        },
        "Languages": {
            "name": "Languages",
            "values": [
                "IT",
                "EN"
            ]
        },
        "TrackerViewModes": {
            "name": "TrackerViewModes",
            "values": [
                "CARD",
                "GRID"
            ]
        },
        "WorkLogState": {
            "name": "WorkLogState",
            "values": [
                "PENDING",
                "LOGGED",
                "DELETED",
                "MERGED"
            ]
        },
        "TrackerState": {
            "name": "TrackerState",
            "values": [
                "STOP",
                "START",
                "PAUSE"
            ]
        }
    },
    "nonModels": {},
    "codegenVersion": "3.3.4",
    "version": "b4df2a579c91d9ca307050c3853e8bfd"
};