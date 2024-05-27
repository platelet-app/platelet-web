/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getTenant = /* GraphQL */ `query GetTenant($id: ID!) {
  getTenant(id: $id) {
    id
    name
    referenceIdentifier
    admin {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    tenantAdminId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTenantQueryVariables, APITypes.GetTenantQuery>;
export const listTenants = /* GraphQL */ `query ListTenants(
  $filter: ModelTenantFilterInput
  $limit: Int
  $nextToken: String
) {
  listTenants(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      referenceIdentifier
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTenantsQueryVariables,
  APITypes.ListTenantsQuery
>;
export const syncTenants = /* GraphQL */ `query SyncTenants(
  $filter: ModelTenantFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncTenants(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      name
      referenceIdentifier
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncTenantsQueryVariables,
  APITypes.SyncTenantsQuery
>;
export const getTenantByTenantName = /* GraphQL */ `query GetTenantByTenantName(
  $name: String!
  $sortDirection: ModelSortDirection
  $filter: ModelTenantFilterInput
  $limit: Int
  $nextToken: String
) {
  getTenantByTenantName(
    name: $name
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      referenceIdentifier
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTenantByTenantNameQueryVariables,
  APITypes.GetTenantByTenantNameQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    cognitoId
    tenantId
    isPrimaryAdmin
    contact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    displayName
    name
    roles
    dateOfBirth
    riderResponsibility
    possibleRiderResponsibilities {
      nextToken
      startedAt
      __typename
    }
    profilePicture {
      bucket
      key
      region
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    assignments {
      nextToken
      startedAt
      __typename
    }
    vehicleAssignments {
      nextToken
      startedAt
      __typename
    }
    createdTasks {
      nextToken
      startedAt
      __typename
    }
    createdLocations {
      nextToken
      startedAt
      __typename
    }
    createdVehicles {
      nextToken
      startedAt
      __typename
    }
    createdScheduledTasks {
      nextToken
      startedAt
      __typename
    }
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const syncUsers = /* GraphQL */ `query SyncUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncUsers(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.SyncUsersQueryVariables, APITypes.SyncUsersQuery>;
export const getUserByCognitoId = /* GraphQL */ `query GetUserByCognitoId(
  $cognitoId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  getUserByCognitoId(
    cognitoId: $cognitoId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserByCognitoIdQueryVariables,
  APITypes.GetUserByCognitoIdQuery
>;
export const getPossibleRiderResponsibilities = /* GraphQL */ `query GetPossibleRiderResponsibilities($id: ID!) {
  getPossibleRiderResponsibilities(id: $id) {
    id
    tenantId
    user {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    riderResponsibility {
      id
      tenantId
      label
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userPossibleRiderResponsibilitiesId
    riderResponsibilityPossibleUsersId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPossibleRiderResponsibilitiesQueryVariables,
  APITypes.GetPossibleRiderResponsibilitiesQuery
>;
export const listPossibleRiderResponsibilities = /* GraphQL */ `query ListPossibleRiderResponsibilities(
  $filter: ModelPossibleRiderResponsibilitiesFilterInput
  $limit: Int
  $nextToken: String
) {
  listPossibleRiderResponsibilities(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      tenantId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userPossibleRiderResponsibilitiesId
      riderResponsibilityPossibleUsersId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPossibleRiderResponsibilitiesQueryVariables,
  APITypes.ListPossibleRiderResponsibilitiesQuery
>;
export const syncPossibleRiderResponsibilities = /* GraphQL */ `query SyncPossibleRiderResponsibilities(
  $filter: ModelPossibleRiderResponsibilitiesFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncPossibleRiderResponsibilities(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      tenantId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userPossibleRiderResponsibilitiesId
      riderResponsibilityPossibleUsersId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncPossibleRiderResponsibilitiesQueryVariables,
  APITypes.SyncPossibleRiderResponsibilitiesQuery
>;
export const getVehicle = /* GraphQL */ `query GetVehicle($id: ID!) {
  getVehicle(id: $id) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    name
    manufacturer
    model
    dateOfManufacture
    dateOfRegistration
    assignments {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedVehiclesId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetVehicleQueryVariables,
  APITypes.GetVehicleQuery
>;
export const listVehicles = /* GraphQL */ `query ListVehicles(
  $filter: ModelVehicleFilterInput
  $limit: Int
  $nextToken: String
) {
  listVehicles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      tenantId
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVehiclesQueryVariables,
  APITypes.ListVehiclesQuery
>;
export const syncVehicles = /* GraphQL */ `query SyncVehicles(
  $filter: ModelVehicleFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncVehicles(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      tenantId
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncVehiclesQueryVariables,
  APITypes.SyncVehiclesQuery
>;
export const getVehicleAssignment = /* GraphQL */ `query GetVehicleAssignment($id: ID!) {
  getVehicleAssignment(id: $id) {
    id
    tenantId
    vehicle {
      id
      tenantId
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
      __typename
    }
    assignee {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userVehicleAssignmentsId
    vehicleAssignmentsId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetVehicleAssignmentQueryVariables,
  APITypes.GetVehicleAssignmentQuery
>;
export const listVehicleAssignments = /* GraphQL */ `query ListVehicleAssignments(
  $filter: ModelVehicleAssignmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listVehicleAssignments(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      tenantId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userVehicleAssignmentsId
      vehicleAssignmentsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVehicleAssignmentsQueryVariables,
  APITypes.ListVehicleAssignmentsQuery
>;
export const syncVehicleAssignments = /* GraphQL */ `query SyncVehicleAssignments(
  $filter: ModelVehicleAssignmentFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncVehicleAssignments(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      tenantId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userVehicleAssignmentsId
      vehicleAssignmentsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncVehicleAssignmentsQueryVariables,
  APITypes.SyncVehicleAssignmentsQuery
>;
export const getLocation = /* GraphQL */ `query GetLocation($id: ID!) {
  getLocation(id: $id) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    name
    listed
    contact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    ward
    line1
    line2
    line3
    town
    county
    state
    country
    postcode
    what3words
    tasksAsPickUp {
      nextToken
      startedAt
      __typename
    }
    tasksAsDropOff {
      nextToken
      startedAt
      __typename
    }
    taskAsEstablishment {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsPickUp {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsDropOff {
      nextToken
      startedAt
      __typename
    }
    scheduledTasksAsEstablishment {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    disabled
    googleMapsPlaceId
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedLocationsId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLocationQueryVariables,
  APITypes.GetLocationQuery
>;
export const listLocations = /* GraphQL */ `query ListLocations(
  $filter: ModelLocationFilterInput
  $limit: Int
  $nextToken: String
) {
  listLocations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLocationsQueryVariables,
  APITypes.ListLocationsQuery
>;
export const syncLocations = /* GraphQL */ `query SyncLocations(
  $filter: ModelLocationFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncLocations(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncLocationsQueryVariables,
  APITypes.SyncLocationsQuery
>;
export const getTask = /* GraphQL */ `query GetTask($id: ID!) {
  getTask(id: $id) {
    id
    tenantId
    createdAt
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    dateCreated
    dateCompleted
    timeOfCall
    timePickedUp
    timePickedUpSenderName
    timeDroppedOff
    timeDroppedOffRecipientName
    timeCancelled
    timeRejected
    timeRiderHome
    requesterContact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    pickUpLocationId
    dropOffLocationId
    establishmentLocationId
    pickUpLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    dropOffLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    establishmentLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    riderResponsibility
    assignees {
      nextToken
      startedAt
      __typename
    }
    priority
    deliverables {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    status
    isRiderUsingOwnVehicle
    archived
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedTasksId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTaskQueryVariables, APITypes.GetTaskQuery>;
export const listTasks = /* GraphQL */ `query ListTasks(
  $filter: ModelTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.ListTasksQueryVariables, APITypes.ListTasksQuery>;
export const syncTasks = /* GraphQL */ `query SyncTasks(
  $filter: ModelTaskFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncTasks(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.SyncTasksQueryVariables, APITypes.SyncTasksQuery>;
export const listTasksByTenantId = /* GraphQL */ `query ListTasksByTenantId(
  $tenantId: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listTasksByTenantId(
    tenantId: $tenantId
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTasksByTenantIdQueryVariables,
  APITypes.ListTasksByTenantIdQuery
>;
export const tasksByStatus = /* GraphQL */ `query TasksByStatus(
  $status: TaskStatus!
  $sortDirection: ModelSortDirection
  $filter: ModelTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  tasksByStatus(
    status: $status
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TasksByStatusQueryVariables,
  APITypes.TasksByStatusQuery
>;
export const tasksByArchivedStatus = /* GraphQL */ `query TasksByArchivedStatus(
  $archived: Int!
  $status: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  tasksByArchivedStatus(
    archived: $archived
    status: $status
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TasksByArchivedStatusQueryVariables,
  APITypes.TasksByArchivedStatusQuery
>;
export const getTaskAssignee = /* GraphQL */ `query GetTaskAssignee($id: ID!) {
  getTaskAssignee(id: $id) {
    id
    tenantId
    role
    task {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    assignee {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userAssignmentsId
    taskAssigneesId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTaskAssigneeQueryVariables,
  APITypes.GetTaskAssigneeQuery
>;
export const listTaskAssignees = /* GraphQL */ `query ListTaskAssignees(
  $filter: ModelTaskAssigneeFilterInput
  $limit: Int
  $nextToken: String
) {
  listTaskAssignees(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      tenantId
      role
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userAssignmentsId
      taskAssigneesId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTaskAssigneesQueryVariables,
  APITypes.ListTaskAssigneesQuery
>;
export const syncTaskAssignees = /* GraphQL */ `query SyncTaskAssignees(
  $filter: ModelTaskAssigneeFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncTaskAssignees(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      tenantId
      role
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userAssignmentsId
      taskAssigneesId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncTaskAssigneesQueryVariables,
  APITypes.SyncTaskAssigneesQuery
>;
export const getScheduledTask = /* GraphQL */ `query GetScheduledTask($id: ID!) {
  getScheduledTask(id: $id) {
    id
    tenantId
    createdBy {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    requesterContact {
      name
      telephoneNumber
      mobileNumber
      emailAddress
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      __typename
    }
    cronExpression
    pickUpLocationId
    dropOffLocationId
    establishmentLocationId
    pickUpLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    dropOffLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    establishmentLocation {
      id
      tenantId
      name
      listed
      ward
      line1
      line2
      line3
      town
      county
      state
      country
      postcode
      what3words
      disabled
      googleMapsPlaceId
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
      __typename
    }
    priority
    deliverables {
      nextToken
      startedAt
      __typename
    }
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCreatedScheduledTasksId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetScheduledTaskQueryVariables,
  APITypes.GetScheduledTaskQuery
>;
export const listScheduledTasks = /* GraphQL */ `query ListScheduledTasks(
  $filter: ModelScheduledTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listScheduledTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      tenantId
      cronExpression
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      priority
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedScheduledTasksId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListScheduledTasksQueryVariables,
  APITypes.ListScheduledTasksQuery
>;
export const syncScheduledTasks = /* GraphQL */ `query SyncScheduledTasks(
  $filter: ModelScheduledTaskFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncScheduledTasks(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      tenantId
      cronExpression
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      priority
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedScheduledTasksId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncScheduledTasksQueryVariables,
  APITypes.SyncScheduledTasksQuery
>;
export const getComment = /* GraphQL */ `query GetComment($id: ID!) {
  getComment(id: $id) {
    id
    parentId
    owner
    tenantId
    body
    author {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
      displayName
      name
      roles
      dateOfBirth
      riderResponsibility
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    visibility
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCommentQueryVariables,
  APITypes.GetCommentQuery
>;
export const listComments = /* GraphQL */ `query ListComments(
  $filter: ModelCommentFilterInput
  $limit: Int
  $nextToken: String
) {
  listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      parentId
      owner
      tenantId
      body
      visibility
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCommentsQueryVariables,
  APITypes.ListCommentsQuery
>;
export const syncComments = /* GraphQL */ `query SyncComments(
  $filter: ModelCommentFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncComments(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      parentId
      owner
      tenantId
      body
      visibility
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncCommentsQueryVariables,
  APITypes.SyncCommentsQuery
>;
export const getDeliverableType = /* GraphQL */ `query GetDeliverableType($id: ID!) {
  getDeliverableType(id: $id) {
    id
    label
    tenantId
    icon
    defaultUnit
    deliverables {
      nextToken
      startedAt
      __typename
    }
    tags
    disabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDeliverableTypeQueryVariables,
  APITypes.GetDeliverableTypeQuery
>;
export const listDeliverableTypes = /* GraphQL */ `query ListDeliverableTypes(
  $filter: ModelDeliverableTypeFilterInput
  $limit: Int
  $nextToken: String
) {
  listDeliverableTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      label
      tenantId
      icon
      defaultUnit
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDeliverableTypesQueryVariables,
  APITypes.ListDeliverableTypesQuery
>;
export const syncDeliverableTypes = /* GraphQL */ `query SyncDeliverableTypes(
  $filter: ModelDeliverableTypeFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncDeliverableTypes(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      label
      tenantId
      icon
      defaultUnit
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncDeliverableTypesQueryVariables,
  APITypes.SyncDeliverableTypesQuery
>;
export const getDeliverable = /* GraphQL */ `query GetDeliverable($id: ID!) {
  getDeliverable(id: $id) {
    id
    tenantId
    deliverableType {
      id
      label
      tenantId
      icon
      defaultUnit
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    task {
      id
      tenantId
      createdAt
      dateCreated
      dateCompleted
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      riderResponsibility
      priority
      status
      isRiderUsingOwnVehicle
      archived
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
      __typename
    }
    scheduledTask {
      id
      tenantId
      cronExpression
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      priority
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedScheduledTasksId
      __typename
    }
    count
    unit
    orderInGrid
    comments {
      nextToken
      startedAt
      __typename
    }
    archived
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    taskDeliverablesId
    scheduledTaskDeliverablesId
    deliverableTypeDeliverablesId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDeliverableQueryVariables,
  APITypes.GetDeliverableQuery
>;
export const listDeliverables = /* GraphQL */ `query ListDeliverables(
  $filter: ModelDeliverableFilterInput
  $limit: Int
  $nextToken: String
) {
  listDeliverables(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      tenantId
      count
      unit
      orderInGrid
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      taskDeliverablesId
      scheduledTaskDeliverablesId
      deliverableTypeDeliverablesId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDeliverablesQueryVariables,
  APITypes.ListDeliverablesQuery
>;
export const syncDeliverables = /* GraphQL */ `query SyncDeliverables(
  $filter: ModelDeliverableFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncDeliverables(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      tenantId
      count
      unit
      orderInGrid
      archived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      taskDeliverablesId
      scheduledTaskDeliverablesId
      deliverableTypeDeliverablesId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncDeliverablesQueryVariables,
  APITypes.SyncDeliverablesQuery
>;
export const getRiderResponsibility = /* GraphQL */ `query GetRiderResponsibility($id: ID!) {
  getRiderResponsibility(id: $id) {
    id
    tenantId
    label
    disabled
    possibleUsers {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetRiderResponsibilityQueryVariables,
  APITypes.GetRiderResponsibilityQuery
>;
export const listRiderResponsibilities = /* GraphQL */ `query ListRiderResponsibilities(
  $filter: ModelRiderResponsibilityFilterInput
  $limit: Int
  $nextToken: String
) {
  listRiderResponsibilities(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      tenantId
      label
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRiderResponsibilitiesQueryVariables,
  APITypes.ListRiderResponsibilitiesQuery
>;
export const syncRiderResponsibilities = /* GraphQL */ `query SyncRiderResponsibilities(
  $filter: ModelRiderResponsibilityFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncRiderResponsibilities(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      tenantId
      label
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncRiderResponsibilitiesQueryVariables,
  APITypes.SyncRiderResponsibilitiesQuery
>;
export const profilePictureUploadURL = /* GraphQL */ `query ProfilePictureUploadURL($userId: ID!) {
  profilePictureUploadURL(userId: $userId)
}
` as GeneratedQuery<
  APITypes.ProfilePictureUploadURLQueryVariables,
  APITypes.ProfilePictureUploadURLQuery
>;
export const profilePictureURL = /* GraphQL */ `query ProfilePictureURL($userId: ID!, $width: Int, $height: Int) {
  profilePictureURL(userId: $userId, width: $width, height: $height)
}
` as GeneratedQuery<
  APITypes.ProfilePictureURLQueryVariables,
  APITypes.ProfilePictureURLQuery
>;
export const sendUserFeedback = /* GraphQL */ `query SendUserFeedback($emailAddress: AWSEmail, $body: String) {
  sendUserFeedback(emailAddress: $emailAddress, body: $body) {
    successState
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SendUserFeedbackQueryVariables,
  APITypes.SendUserFeedbackQuery
>;
