export const schema = {
    "models": {
        "Tenant": {
            "name": "Tenant",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "referenceIdentifier": {
                    "name": "referenceIdentifier",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "admin": {
                    "name": "admin",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "HAS_ONE",
                        "associatedWith": "id",
                        "targetName": "tenantAdminId"
                    }
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
                },
                "tenantAdminId": {
                    "name": "tenantAdminId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Tenants",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantName",
                        "queryField": "getTenantByTenantName",
                        "fields": [
                            "name"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "allow": "private",
                                "provider": "iam",
                                "operations": [
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "User": {
            "name": "User",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "username": {
                    "name": "username",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "cognitoId": {
                    "name": "cognitoId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "isPrimaryAdmin": {
                    "name": "isPrimaryAdmin",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "contact": {
                    "name": "contact",
                    "isArray": false,
                    "type": {
                        "nonModel": "AddressAndContactDetails"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "displayName": {
                    "name": "displayName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "roles": {
                    "name": "roles",
                    "isArray": true,
                    "type": {
                        "enum": "Role"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": false
                },
                "dateOfBirth": {
                    "name": "dateOfBirth",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "riderResponsibility": {
                    "name": "riderResponsibility",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "possibleRiderResponsibilities": {
                    "name": "possibleRiderResponsibilities",
                    "isArray": true,
                    "type": {
                        "model": "PossibleRiderResponsibilities"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userPossibleRiderResponsibilitiesId"
                    }
                },
                "profilePicture": {
                    "name": "profilePicture",
                    "isArray": false,
                    "type": {
                        "nonModel": "S3Object"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userCommentsId"
                    }
                },
                "assignments": {
                    "name": "assignments",
                    "isArray": true,
                    "type": {
                        "model": "TaskAssignee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userAssignmentsId"
                    }
                },
                "vehicleAssignments": {
                    "name": "vehicleAssignments",
                    "isArray": true,
                    "type": {
                        "model": "VehicleAssignment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userVehicleAssignmentsId"
                    }
                },
                "createdTasks": {
                    "name": "createdTasks",
                    "isArray": true,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userCreatedTasksId"
                    }
                },
                "createdLocations": {
                    "name": "createdLocations",
                    "isArray": true,
                    "type": {
                        "model": "Location"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userCreatedLocationsId"
                    }
                },
                "createdVehicles": {
                    "name": "createdVehicles",
                    "isArray": true,
                    "type": {
                        "model": "Vehicle"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userCreatedVehiclesId"
                    }
                },
                "createdScheduledTasks": {
                    "name": "createdScheduledTasks",
                    "isArray": true,
                    "type": {
                        "model": "ScheduledTask"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userCreatedScheduledTasksId"
                    }
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
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
            "pluralName": "Users",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCognitoId",
                        "queryField": "getUserByCognitoId",
                        "fields": [
                            "cognitoId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "cognitoId",
                                "allow": "owner",
                                "operations": [
                                    "read",
                                    "update"
                                ],
                                "identityClaim": "cognito:username"
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "read",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "PossibleRiderResponsibilities": {
            "name": "PossibleRiderResponsibilities",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "user": {
                    "name": "user",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userPossibleRiderResponsibilitiesId"
                    }
                },
                "riderResponsibility": {
                    "name": "riderResponsibility",
                    "isArray": false,
                    "type": {
                        "model": "RiderResponsibility"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "riderResponsibilityPossibleUsersId"
                    }
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
            "pluralName": "PossibleRiderResponsibilities",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Vehicle": {
            "name": "Vehicle",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "createdBy": {
                    "name": "createdBy",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userCreatedVehiclesId"
                    }
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "manufacturer": {
                    "name": "manufacturer",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "model": {
                    "name": "model",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dateOfManufacture": {
                    "name": "dateOfManufacture",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "dateOfRegistration": {
                    "name": "dateOfRegistration",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "assignments": {
                    "name": "assignments",
                    "isArray": true,
                    "type": {
                        "model": "VehicleAssignment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "vehicleAssignmentsId"
                    }
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "parentId"
                    }
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
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
            "pluralName": "Vehicles",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "VehicleAssignment": {
            "name": "VehicleAssignment",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "vehicle": {
                    "name": "vehicle",
                    "isArray": false,
                    "type": {
                        "model": "Vehicle"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "vehicleAssignmentsId"
                    }
                },
                "assignee": {
                    "name": "assignee",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userVehicleAssignmentsId"
                    }
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
            "pluralName": "VehicleAssignments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN",
                                    "COORDINATOR",
                                    "RIDER"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Location": {
            "name": "Location",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "createdBy": {
                    "name": "createdBy",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userCreatedLocationsId"
                    }
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "listed": {
                    "name": "listed",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "contact": {
                    "name": "contact",
                    "isArray": false,
                    "type": {
                        "nonModel": "AddressAndContactDetails"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "ward": {
                    "name": "ward",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line1": {
                    "name": "line1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line2": {
                    "name": "line2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line3": {
                    "name": "line3",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "town": {
                    "name": "town",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "county": {
                    "name": "county",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "country": {
                    "name": "country",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "postcode": {
                    "name": "postcode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "what3words": {
                    "name": "what3words",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "tasksAsPickUp": {
                    "name": "tasksAsPickUp",
                    "isArray": true,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "pickUpLocation"
                    }
                },
                "tasksAsDropOff": {
                    "name": "tasksAsDropOff",
                    "isArray": true,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "dropOffLocation"
                    }
                },
                "taskAsEstablishment": {
                    "name": "taskAsEstablishment",
                    "isArray": true,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "establishmentLocation"
                    }
                },
                "scheduledTasksAsPickUp": {
                    "name": "scheduledTasksAsPickUp",
                    "isArray": true,
                    "type": {
                        "model": "ScheduledTask"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "pickUpLocation"
                    }
                },
                "scheduledTasksAsDropOff": {
                    "name": "scheduledTasksAsDropOff",
                    "isArray": true,
                    "type": {
                        "model": "ScheduledTask"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "dropOffLocation"
                    }
                },
                "scheduledTasksAsEstablishment": {
                    "name": "scheduledTasksAsEstablishment",
                    "isArray": true,
                    "type": {
                        "model": "ScheduledTask"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "establishmentLocation"
                    }
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "parentId"
                    }
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "googleMapsPlaceId": {
                    "name": "googleMapsPlaceId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "archived": {
                    "name": "archived",
                    "isArray": false,
                    "type": "Int",
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
            "pluralName": "Locations",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byArchived",
                        "fields": [
                            "archived"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN",
                                    "COORDINATOR"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update",
                                    "delete"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Task": {
            "name": "Task",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "createdBy": {
                    "name": "createdBy",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userCreatedTasksId"
                    }
                },
                "dateCreated": {
                    "name": "dateCreated",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": true,
                    "attributes": []
                },
                "dateCompleted": {
                    "name": "dateCompleted",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "timeOfCall": {
                    "name": "timeOfCall",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timePickedUp": {
                    "name": "timePickedUp",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timePickedUpSenderName": {
                    "name": "timePickedUpSenderName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "timeDroppedOff": {
                    "name": "timeDroppedOff",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timeDroppedOffRecipientName": {
                    "name": "timeDroppedOffRecipientName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "timeCancelled": {
                    "name": "timeCancelled",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timeRejected": {
                    "name": "timeRejected",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timeRiderHome": {
                    "name": "timeRiderHome",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "requesterContact": {
                    "name": "requesterContact",
                    "isArray": false,
                    "type": {
                        "nonModel": "AddressAndContactDetails"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "pickUpLocation": {
                    "name": "pickUpLocation",
                    "isArray": false,
                    "type": {
                        "model": "Location"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "pickUpLocationId"
                    }
                },
                "dropOffLocation": {
                    "name": "dropOffLocation",
                    "isArray": false,
                    "type": {
                        "model": "Location"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "dropOffLocationId"
                    }
                },
                "establishmentLocation": {
                    "name": "establishmentLocation",
                    "isArray": false,
                    "type": {
                        "model": "Location"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "establishmentLocationId"
                    }
                },
                "riderResponsibility": {
                    "name": "riderResponsibility",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "assignees": {
                    "name": "assignees",
                    "isArray": true,
                    "type": {
                        "model": "TaskAssignee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "taskAssigneesId"
                    }
                },
                "priority": {
                    "name": "priority",
                    "isArray": false,
                    "type": {
                        "enum": "Priority"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "deliverables": {
                    "name": "deliverables",
                    "isArray": true,
                    "type": {
                        "model": "Deliverable"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "taskDeliverablesId"
                    }
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "parentId"
                    }
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": {
                        "enum": "TaskStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "isRiderUsingOwnVehicle": {
                    "name": "isRiderUsingOwnVehicle",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "archived": {
                    "name": "archived",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
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
            "pluralName": "Tasks",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "queryField": "listTasksByTenantId",
                        "fields": [
                            "tenantId",
                            "createdAt"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byPickUpLocation",
                        "fields": [
                            "pickUpLocationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byDropOffLocation",
                        "fields": [
                            "dropOffLocationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byEstasblishmentLocation",
                        "fields": [
                            "establishmentLocationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byStatus",
                        "queryField": "tasksByStatus",
                        "fields": [
                            "status"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byArchivedStatus",
                        "queryField": "tasksByArchivedStatus",
                        "fields": [
                            "archived",
                            "status"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "COORDINATOR",
                                    "RIDER",
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "TaskAssignee": {
            "name": "TaskAssignee",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "role": {
                    "name": "role",
                    "isArray": false,
                    "type": {
                        "enum": "Role"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "task": {
                    "name": "task",
                    "isArray": false,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "taskAssigneesId"
                    }
                },
                "assignee": {
                    "name": "assignee",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userAssignmentsId"
                    }
                },
                "archived": {
                    "name": "archived",
                    "isArray": false,
                    "type": "Int",
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
            "pluralName": "TaskAssignees",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byArchived",
                        "fields": [
                            "archived"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "COORDINATOR",
                                    "RIDER",
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "ScheduledTask": {
            "name": "ScheduledTask",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "createdBy": {
                    "name": "createdBy",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userCreatedScheduledTasksId"
                    }
                },
                "requesterContact": {
                    "name": "requesterContact",
                    "isArray": false,
                    "type": {
                        "nonModel": "AddressAndContactDetails"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "cronExpression": {
                    "name": "cronExpression",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "pickUpLocation": {
                    "name": "pickUpLocation",
                    "isArray": false,
                    "type": {
                        "model": "Location"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "pickUpLocationId"
                    }
                },
                "dropOffLocation": {
                    "name": "dropOffLocation",
                    "isArray": false,
                    "type": {
                        "model": "Location"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "dropOffLocationId"
                    }
                },
                "establishmentLocation": {
                    "name": "establishmentLocation",
                    "isArray": false,
                    "type": {
                        "model": "Location"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "establishmentLocationId"
                    }
                },
                "priority": {
                    "name": "priority",
                    "isArray": false,
                    "type": {
                        "enum": "Priority"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "deliverables": {
                    "name": "deliverables",
                    "isArray": true,
                    "type": {
                        "model": "Deliverable"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "scheduledTaskDeliverablesId"
                    }
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
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
            "pluralName": "ScheduledTasks",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "scheduledTasksByPickUpLocation",
                        "fields": [
                            "pickUpLocationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "scheduledTasksByDropOffLocation",
                        "fields": [
                            "dropOffLocationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "scheduledTasksByEstasblishmentLocation",
                        "fields": [
                            "establishmentLocationId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Comment": {
            "name": "Comment",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "parentId": {
                    "name": "parentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "owner": {
                    "name": "owner",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "body": {
                    "name": "body",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "author": {
                    "name": "author",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userCommentsId"
                    }
                },
                "visibility": {
                    "name": "visibility",
                    "isArray": false,
                    "type": {
                        "enum": "CommentVisibility"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "archived": {
                    "name": "archived",
                    "isArray": false,
                    "type": "Int",
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
            "pluralName": "Comments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byParent",
                        "fields": [
                            "parentId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byArchived",
                        "fields": [
                            "archived"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "USER"
                                ],
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "operations": [
                                    "create",
                                    "read",
                                    "delete",
                                    "update"
                                ],
                                "identityClaim": "cognito:username"
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "DeliverableType": {
            "name": "DeliverableType",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "label": {
                    "name": "label",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "icon": {
                    "name": "icon",
                    "isArray": false,
                    "type": {
                        "enum": "DeliverableTypeIcon"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "defaultUnit": {
                    "name": "defaultUnit",
                    "isArray": false,
                    "type": {
                        "enum": "DeliverableUnit"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "deliverables": {
                    "name": "deliverables",
                    "isArray": true,
                    "type": {
                        "model": "Deliverable"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "deliverableTypeDeliverablesId"
                    }
                },
                "tags": {
                    "name": "tags",
                    "isArray": true,
                    "type": "String",
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
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
            "pluralName": "DeliverableTypes",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Deliverable": {
            "name": "Deliverable",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "deliverableType": {
                    "name": "deliverableType",
                    "isArray": false,
                    "type": {
                        "model": "DeliverableType"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "deliverableTypeDeliverablesId"
                    }
                },
                "task": {
                    "name": "task",
                    "isArray": false,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "taskDeliverablesId"
                    }
                },
                "scheduledTask": {
                    "name": "scheduledTask",
                    "isArray": false,
                    "type": {
                        "model": "ScheduledTask"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "scheduledTaskDeliverablesId"
                    }
                },
                "count": {
                    "name": "count",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "unit": {
                    "name": "unit",
                    "isArray": false,
                    "type": {
                        "enum": "DeliverableUnit"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "orderInGrid": {
                    "name": "orderInGrid",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "parentId"
                    }
                },
                "archived": {
                    "name": "archived",
                    "isArray": false,
                    "type": "Int",
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
            "pluralName": "Deliverables",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byArchived",
                        "fields": [
                            "archived"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN",
                                    "COORDINATOR",
                                    "RIDER"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "RiderResponsibility": {
            "name": "RiderResponsibility",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "label": {
                    "name": "label",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "possibleUsers": {
                    "name": "possibleUsers",
                    "isArray": true,
                    "type": {
                        "model": "PossibleRiderResponsibilities"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "riderResponsibilityPossibleUsersId"
                    }
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
            "pluralName": "RiderResponsibilities",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "DeliverableTypeIcon": {
            "name": "DeliverableTypeIcon",
            "values": [
                "BUG",
                "CHILD",
                "DOCUMENT",
                "EQUIPMENT",
                "OTHER"
            ]
        },
        "TaskStatus": {
            "name": "TaskStatus",
            "values": [
                "NEW",
                "ACTIVE",
                "PICKED_UP",
                "DROPPED_OFF",
                "CANCELLED",
                "REJECTED",
                "ABANDONED",
                "COMPLETED",
                "PENDING"
            ]
        },
        "Priority": {
            "name": "Priority",
            "values": [
                "HIGH",
                "MEDIUM",
                "LOW"
            ]
        },
        "DeliverableUnit": {
            "name": "DeliverableUnit",
            "values": [
                "NONE",
                "LITER",
                "MILLILITER",
                "GRAM",
                "ITEM",
                "BOX"
            ]
        },
        "Role": {
            "name": "Role",
            "values": [
                "USER",
                "COORDINATOR",
                "RIDER",
                "ADMIN"
            ]
        },
        "CommentVisibility": {
            "name": "CommentVisibility",
            "values": [
                "EVERYONE",
                "ME"
            ]
        }
    },
    "nonModels": {
        "S3Object": {
            "name": "S3Object",
            "fields": {
                "bucket": {
                    "name": "bucket",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "key": {
                    "name": "key",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "region": {
                    "name": "region",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "AddressAndContactDetails": {
            "name": "AddressAndContactDetails",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "telephoneNumber": {
                    "name": "telephoneNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "mobileNumber": {
                    "name": "mobileNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "emailAddress": {
                    "name": "emailAddress",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "ward": {
                    "name": "ward",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line1": {
                    "name": "line1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line2": {
                    "name": "line2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line3": {
                    "name": "line3",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "town": {
                    "name": "town",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "county": {
                    "name": "county",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "country": {
                    "name": "country",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "postcode": {
                    "name": "postcode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "what3words": {
                    "name": "what3words",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "SendFeedback": {
            "name": "SendFeedback",
            "fields": {
                "successState": {
                    "name": "successState",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Statistics": {
            "name": "Statistics",
            "fields": {
                "numCancelled": {
                    "name": "numCancelled",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numCompleted": {
                    "name": "numCompleted",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numDroppedOff": {
                    "name": "numDroppedOff",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numRejected": {
                    "name": "numRejected",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numAbandoned": {
                    "name": "numAbandoned",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numActive": {
                    "name": "numActive",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numPickedUp": {
                    "name": "numPickedUp",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numNew": {
                    "name": "numNew",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numTest": {
                    "name": "numTest",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                }
            }
        }
    },
    "codegenVersion": "3.4.4",
    "version": "e8a37f7291c48282a191ed3e232cee52"
};