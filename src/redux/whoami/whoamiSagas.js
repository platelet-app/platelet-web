import { call, put, take, takeLatest } from "redux-saga/effects";
import * as Sentry from "@sentry/react";
import {
    GET_WHOAMI_REQUEST,
    getWhoamiFailure,
    getWhoamiSuccess,
    REFRESH_WHOAMI_REQUEST,
    setTenantId,
    INIT_WHOAMI_OBSERVER,
    initWhoamiObserver,
} from "./whoamiActions";
import API from "@aws-amplify/api";
import { Auth, DataStore, syncExpression } from "aws-amplify";
import * as models from "../../models";
import * as queries from "../../graphql/queries";
import { NotFound } from "http-errors";
import { userRoles } from "../../apiConsts";
import { eventChannel } from "redux-saga";
import dataStoreConflictHandler from "./dataStoreConflictHandler";

const fakeUser = {
    id: "offline",
    name: "offline",
    username: "offline",
    displayName: "Offline User",
    roles: Object.values(userRoles),
    dateOfBirth: null,
    profilePictureThumbnailURL: null,
};

function listener(userId) {
    return eventChannel((emitter) => {
        let observer = { unsubscribe: () => {} };
        observer = DataStore.observe(models.User, userId).subscribe(
            ({ element }) => emitter(element)
        );
        return () => {
            observer.unsubscribe();
        };
    });
}

function* whoamiObserver(action) {
    const channel = yield call(listener, action.whoamiId);
    try {
        while (true) {
            const result = yield take(channel);
            yield put(getWhoamiSuccess(result));
        }
    } finally {
        console.log("stopping whoami observer");
        channel.close();
    }
}

export function* watchInitWhoamiObserver() {
    yield takeLatest(INIT_WHOAMI_OBSERVER, whoamiObserver);
}

function* getWhoami() {
    if (
        process.env.REACT_APP_DEMO_MODE === "true" ||
        process.env.REACT_APP_OFFLINE_ONLY === "true"
    ) {
        const existingUser = yield call(
            [DataStore, DataStore.query],
            models.User,
            (u) => u.name("eq", "offline")
        );
        if (existingUser.length === 0) {
            let userResult = fakeUser;
            const userModel = yield new models.User(userResult);
            const newFakeUser = yield call(
                [DataStore, DataStore.save],
                userModel
            );
            yield put(getWhoamiSuccess(newFakeUser));
            yield put(initWhoamiObserver(newFakeUser.id));
        } else {
            yield put(getWhoamiSuccess(existingUser[0]));
            yield put(initWhoamiObserver(existingUser[0].id));
        }
        yield put(setTenantId("offline"));
    } else {
        try {
            const loggedInUser = yield call([
                Auth,
                Auth.currentAuthenticatedUser,
            ]);
            let result;
            if (loggedInUser) {
                if (
                    !loggedInUser.attributes ||
                    !loggedInUser.attributes["sub"]
                ) {
                    yield put(getWhoamiFailure("User has no sub id"));
                    return;
                }
                const subId = loggedInUser.attributes["sub"];
                let tenantId = yield call(
                    [localStorage, localStorage.getItem],
                    "userTenantId"
                );
                if (!tenantId) {
                    console.log(
                        "No tenant id found in local storage, retrieving from the API"
                    );
                    const userInfo = yield call([API, API.graphql], {
                        query: queries.getUserByCognitoId,
                        variables: { cognitoId: subId },
                    });
                    tenantId =
                        userInfo?.data?.getUserByCognitoId?.items[0]?.tenantId;
                    if (tenantId) {
                        yield call(
                            [localStorage, localStorage.setItem],
                            "userTenantId",
                            tenantId
                        );
                    }
                }
                if (!tenantId) {
                    throw new NotFound("Could not find tenant id for user");
                }
                console.log("Found user with tenant Id", tenantId);
                const modelsToSync = [
                    models.User,
                    models.RiderResponsibility,
                    models.Vehicle,
                    models.DeliverableType,
                    models.PossibleRiderResponsibilities,
                    models.ScheduledTask,
                    models.VehicleAssignment,
                ];
                const archivedModels = [
                    models.Task,
                    models.Comment,
                    models.Location,
                    models.TaskAssignee,
                    models.Deliverable,
                ];

                yield call([DataStore, DataStore.configure], {
                    errorHandler: (err) => {
                        console.log("DataStore error:", err);
                        console.log("Cause:", err.cause);
                        if (process.env.REACT_APP_DEMO_MODE === "false")
                            Sentry.captureMessage(
                                `DataStore error: ${err.message}, ${err.cause}`
                            );
                    },
                    syncExpressions: [
                        ...modelsToSync.map((model) =>
                            syncExpression(model, (m) =>
                                m.tenantId("eq", tenantId)
                            )
                        ),
                        ...archivedModels.map((model) =>
                            syncExpression(model, (m) =>
                                m.tenantId("eq", tenantId).archived("eq", 0)
                            )
                        ),
                        syncExpression(models.Tenant, (m) =>
                            m.id("eq", tenantId)
                        ),
                    ],
                    conflictHandler: dataStoreConflictHandler,
                });
                result = yield call(
                    [DataStore, DataStore.query],
                    models.User,
                    (t) => t.cognitoId("eq", loggedInUser.attributes.sub)
                );
                if (result && result.length === 0) {
                    result = yield call([API, API.graphql], {
                        query: queries.getUserByCognitoId,
                        variables: { cognitoId: loggedInUser.attributes.sub },
                    });
                    if (
                        result &&
                        result.data &&
                        result.data.getUserByCognitoId &&
                        result.data.getUserByCognitoId.items &&
                        result.data.getUserByCognitoId.items.length > 0
                    ) {
                        yield put(
                            getWhoamiSuccess(
                                result.data.getUserByCognitoId.items[0]
                            )
                        );
                        yield put(
                            initWhoamiObserver(
                                result.data.getUserByCognitoId.items[0].id
                            )
                        );
                    } else {
                        throw new NotFound("Could not find logged in user");
                    }
                } else {
                    yield put(getWhoamiSuccess(result[0]));
                    yield put(initWhoamiObserver(result[0].id));
                }
                yield put(setTenantId(tenantId));
            } else {
                yield put(
                    getWhoamiFailure(
                        new NotFound("Could not find logged in user")
                    )
                );
            }
        } catch (error) {
            console.log(error);
            yield put(getWhoamiFailure(error));
        }
    }
}

export function* watchGetWhoami() {
    yield takeLatest(GET_WHOAMI_REQUEST, getWhoami);
}

export function* watchRefreshWhoami() {
    yield takeLatest(REFRESH_WHOAMI_REQUEST, getWhoami);
}

export const testFunctions = {
    getWhoami,
};
