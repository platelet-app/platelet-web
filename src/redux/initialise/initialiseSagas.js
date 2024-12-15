import { put, takeLatest, call, all } from "redux-saga/effects";
import { v4 as uuidv4 } from "uuid";
import faker from "faker/locale/en_GB";
import { initialiseAwsDataStoreListener } from "../awsHubListener/awsHubListenerActions";
import { initialiseBroadcastAPIListener } from "../broadcastAPI/broadcastAPIActions";
import { GET_WHOAMI_SUCCESS, getWhoamiRequest } from "../whoami/whoamiActions";
import * as actions from "./initialiseActions";
import fakeData from "../fakeOfflineData.json";
import * as models from "../../models/index";
import { DataStore } from "aws-amplify";
import _ from "lodash";
import path from "path-browserify";
import {
    commentVisibility,
    priorities,
    tasksStatus,
    userRoles,
} from "../../apiConsts";
import { initTaskAssignees } from "../taskAssignees/taskAssigneesActions";
import { initTaskDeliverables } from "../taskDeliverables/taskDeliverablesActions";
import { initComments } from "../comments/commentsActions";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function generateTimes(previous = null, hours = 2) {
    let date;
    if (previous) date = new Date(previous);
    else date = new Date();
    if (!previous) date.setHours(date.getHours() - hours);
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timeOfCall = date.toISOString();
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timePickedUp = date.toISOString();
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timeDroppedOff = date.toISOString();
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timeCompleted = date.toISOString();

    return { timeDroppedOff, timePickedUp, timeOfCall, timeCompleted };
}

let profilePictures = [];
let profilePictureThumbnails = [];
if (
    process.env.NODE_ENV !== "test" &&
    process.env.REACT_APP_POPULATE_FAKE_DATA === "true"
) {
    for (const i of _.range(1, 23)) {
        profilePictures.push(`${_.padStart(i, 4, "0")}.jpg`);
        profilePictureThumbnails.push(`${_.padStart(i, 4, "0")}_thumbnail.jpg`);
    }
}

function* initialiseApp() {
    if (process.env.REACT_APP_DEMO_MODE === "true") {
        /*yield call([DataStore, DataStore.start]);
        yield call([DataStore, DataStore.stop]);
        yield call([DataStore, DataStore.clear]);
        yield call([DataStore, DataStore.start]);*/
    }
    if (process.env.NODE_ENV !== "test") {
        if (
            process.env.REACT_APP_DEMO_MODE === "true" ||
            (process.env.REACT_APP_OFFLINE_ONLY === "true" &&
                process.env.REACT_APP_POPULATE_FAKE_DATA === "true")
        ) {
            yield call(populateFakeData);
            yield call(populateTasks);
        }
    }
    yield put(initialiseAwsDataStoreListener());
    yield put(getWhoamiRequest());
}

export function* watchInitialiseApp() {
    yield takeLatest(actions.INITIALISE_APP, initialiseApp);
}

function* initialiseBroadcastAPI() {
    yield all([put(initialiseBroadcastAPIListener())]);
}

function* initialiseObservers() {
    yield all([
        put(initTaskAssignees()),
        put(initTaskDeliverables()),
        put(initComments()),
    ]);
}

export function* watchInitialWhoamiCompleted() {
    yield takeLatest(GET_WHOAMI_SUCCESS, initialiseBroadcastAPI);
    yield takeLatest(GET_WHOAMI_SUCCESS, initialiseObservers);
}

async function populateFakeData() {
    if (fakeData.responsibilities) {
        const checker = await DataStore.query(models.RiderResponsibility);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.responsibilities)) {
                await DataStore.save(new models.RiderResponsibility(value));
            }
        }
    }
    const responsibilities = await DataStore.query(models.RiderResponsibility);
    const offlineUser = await DataStore.query(models.User, (u) =>
        u.name("eq", "offline")
    );
    if (offlineUser.length === 0) {
        const profilePicture = profilePictures.pop();
        let thumbnailKey = null;
        let profilePictureKey = null;
        if (profilePicture) {
            const extension = path.extname(profilePicture);
            const baseName = path.basename(profilePicture, extension);
            thumbnailKey = `profilePictureThumbnails/${baseName}_thumbnail${extension}`;
            profilePictureKey = `profilePictures/${baseName}${extension}`;
        }
        const resp1 = _.sample(responsibilities);
        const resp2 = _.sample(
            responsibilities.filter((r) => r.id !== resp1.id)
        );
        const offlineUser = await DataStore.save(
            new models.User({
                name: "offline",
                username: "offline",
                riderResponsibility: resp1.label,
                displayName: "Demo User",
                dateOfBirth: faker.date
                    .past(50, new Date())
                    .toISOString()
                    .split("T")[0],
                profilePicture: {
                    key: profilePictureKey,
                    bucket: process.env
                        .REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_NAME,
                    region: process.env
                        .REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_REGION,
                },
                profilePictureThumbnail: {
                    key: thumbnailKey,
                    bucket: process.env
                        .REACT_APP_DEMO_PROFILE_PICTURES_THUMBNAILS_BUCKET_NAME,
                    region: process.env
                        .REACT_APP_DEMO_PROFILE_PICTURES_THUMBNAILS_BUCKET_REGION,
                },
                roles: [userRoles.rider, userRoles.coordinator, userRoles.user],
            })
        );
        for (const i of [resp1, resp2]) {
            await DataStore.save(
                new models.PossibleRiderResponsibilities({
                    user: offlineUser,
                    riderResponsibility: i,
                })
            );
        }
    }
    const checker = await DataStore.query(models.User);
    if (checker.length < 2) {
        _.range(5).forEach(async () => {
            const generatedName = faker.name.findName();
            let userToSave = {
                name: generatedName,
                username: uuidv4(),
                displayName: generatedName,
                dateOfBirth: faker.date
                    .past(50, new Date())
                    .toISOString()
                    .split("T")[0],
                contact: {
                    line1: faker.address.streetAddress(),
                    line2: faker.address.secondaryAddress(),
                    town: faker.address.city(),
                    postcode: faker.address.zipCode(),
                    country: faker.address.country(),
                    what3words: "some.what.words",
                    telephoneNumber: faker.phone.phoneNumber(),
                    emailAddress: faker.internet.email(),
                    mobileNumber: faker.phone.phoneNumber(),
                },

                roles: [userRoles.rider, userRoles.coordinator, userRoles.user],
            };

            const profilePicture = profilePictures.pop();
            let thumbnailKey = null;
            let profilePictureKey = null;
            if (profilePicture) {
                const extension = path.extname(profilePicture);
                const baseName = path.basename(profilePicture, extension);
                thumbnailKey = `profilePictureThumbnails/${baseName}_thumbnail${extension}`;
                profilePictureKey = `profilePictures/${baseName}${extension}`;
            }

            const resp1 = _.sample(responsibilities);
            const resp2 = _.sample(
                responsibilities.filter((r) => r.id !== resp1.id)
            );
            const newUser = await DataStore.save(
                new models.User({
                    ...userToSave,
                    riderResponsibility: resp1.label,
                    profilePicture: {
                        key: profilePictureKey,
                        bucket: process.env
                            .REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_NAME,
                        region: process.env
                            .REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_REGION,
                    },
                    profilePictureThumbnail: {
                        key: thumbnailKey,
                        bucket: process.env
                            .REACT_APP_DEMO_PROFILE_PICTURES_THUMBNAILS_BUCKET_NAME,
                        region: process.env
                            .REACT_APP_DEMO_PROFILE_PICTURES_THUMBNAILS_BUCKET_REGION,
                    },
                })
            );
            for (const i of [resp1, resp2]) {
                await DataStore.save(
                    new models.PossibleRiderResponsibilities({
                        user: newUser,
                        riderResponsibility: i,
                    })
                );
            }
        });
    }
    if (fakeData.vehicles) {
        const checker = await DataStore.query(models.Vehicle);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.vehicles)) {
                let { dateOfManufacture, dateOfRegistration, ...rest } = value;
                dateOfRegistration = new Date().toISOString().split("T")[0];
                dateOfManufacture = new Date().toISOString().split("T")[0];
                await DataStore.save(
                    new models.Vehicle({
                        ...rest,
                        dateOfManufacture,
                        dateOfRegistration,
                    })
                );
            }
        }
    }
    if (fakeData.deliverables) {
        const checker = await DataStore.query(models.DeliverableType);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.deliverables)) {
                await DataStore.save(new models.DeliverableType(value));
            }
        }
    }
    if (fakeData.locations) {
        const checker = await DataStore.query(models.Location);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.locations)) {
                const { address, ...rest } = value;
                const contact = {
                    telephoneNumber: faker.phone.phoneNumber(),
                    emailAddress: faker.internet.email(),
                    name: faker.name.findName(),
                };
                await DataStore.save(
                    new models.Location({
                        contact,
                        ...rest,
                        ...address,
                    })
                );
            }
        }
    }
}

async function randomComment(task) {
    // random chance in 4 of making a comment on a task
    const body = "A comment!";

    if (Math.floor(Math.random() * 10000) % 4 === 0) {
        const author = await DataStore.query(models.User, (u) =>
            u.name("eq", "offline")
        );
        if (author[0]) {
            await DataStore.save(
                new models.Comment({
                    author: author[0],
                    body,
                    parentId: task.id,
                    visibility: commentVisibility.everyone,
                })
            );
        }
    }
}

function generateRequesterContact() {
    return {
        name: faker.name.findName(),
        telephoneNumber: faker.phone.phoneNumber(),
    };
}

async function populateTasks() {
    const whoamiFind = await DataStore.query(models.User, (u) =>
        u.name("eq", "offline")
    );
    const availableDeliverables = await DataStore.query(models.DeliverableType);
    const availableRiders = (await DataStore.query(models.User)).filter(
        (u) => u.roles && u.roles.includes(userRoles.rider)
    );
    const availableLocations = await DataStore.query(models.Location, (l) =>
        l.listed("eq", 1)
    );
    const whoami = whoamiFind[0];

    // tasksNew
    const tasksNewCheck = await DataStore.query(models.Task, (t) =>
        t.status("eq", tasksStatus.new)
    );
    if (tasksNewCheck.length === 0) {
        let timeOfCall = null;
        _.range(2).forEach(async () => {
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            timeOfCall = generateTimes(timeOfCall, 2).timeOfCall;
            const requesterContact = generateRequesterContact();
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status: tasksStatus.new,
                    priority,
                    timeOfCall,
                    pickUpLocation,
                    dropOffLocation,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            const deliverableType = _.sample(availableDeliverables);
            await DataStore.save(
                new models.Deliverable({
                    deliverableType,
                    unit: deliverableType.defaultUnit || "NONE",
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
        });
    }
    // tasksCancelledRejected
    const tasksCancelledCheck = await DataStore.query(models.Task, (t) =>
        t.status("eq", tasksStatus.cancelled)
    );
    const tasksRejectedCheck = await DataStore.query(models.Task, (t) =>
        t.status("eq", tasksStatus.rejected)
    );
    if ([...tasksCancelledCheck, ...tasksRejectedCheck].length === 0) {
        for (const i in _.range(5)) {
            let timeOfCall = null;
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            timeOfCall = generateTimes(timeOfCall, 3).timeOfCall;
            const requesterContact = generateRequesterContact();
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status:
                        i > 1 ? tasksStatus.rejected : tasksStatus.cancelled,
                    priority,
                    timeOfCall,
                    timeRejected: i > 1 ? new Date().toISOString() : null,
                    timeCancelled: i > 1 ? null : new Date().toISOString(),
                    pickUpLocation,
                    dropOffLocation,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            const deliverableType = _.sample(availableDeliverables);
            await DataStore.save(
                new models.Deliverable({
                    deliverableType,
                    unit: deliverableType.defaultUnit || "NONE",
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
            randomComment(newTask);
        }
    }
    // tasksActive
    const tasksActiveCheck = await DataStore.query(models.Task, (task) =>
        task.status("eq", tasksStatus.active)
    );
    if (tasksActiveCheck.length === 0) {
        let timeOfCall = null;
        _.range(10).forEach(async () => {
            timeOfCall = generateTimes(timeOfCall, 3).timeOfCall;
            const requesterContact = generateRequesterContact();
            const rider = _.sample(availableRiders);
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status: tasksStatus.active,
                    priority,
                    timeOfCall,
                    pickUpLocation,
                    dropOffLocation,
                    riderResponsibility: rider.riderResponsibility,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            const deliverableType = _.sample(availableDeliverables);
            await DataStore.save(
                new models.Deliverable({
                    deliverableType,
                    unit: deliverableType.defaultUnit || "NONE",
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: rider,
                    role: userRoles.rider,
                })
            );
            randomComment(newTask);
        });
    }
    // tasksPickedUp
    const tasksPickedUpCheck = await DataStore.query(models.Task, (task) =>
        task.status("eq", tasksStatus.pickedUp)
    );
    if (tasksPickedUpCheck.length === 0) {
        let timeOfCall = null;
        _.range(5).forEach(async () => {
            const times = generateTimes(timeOfCall, 3);
            timeOfCall = times.timeOfCall;
            const requesterContact = generateRequesterContact();
            const rider = _.sample(availableRiders);
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status: tasksStatus.pickedUp,
                    priority,
                    timeOfCall,
                    pickUpLocation,
                    establishmentLocation: pickUpLocation,
                    timePickedUp: times.timePickedUp,
                    timePickedUpSenderName: faker.name.firstName(),
                    dropOffLocation,
                    riderResponsibility: rider.riderResponsibility,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            const deliverableType = _.sample(availableDeliverables);
            await DataStore.save(
                new models.Deliverable({
                    deliverableType,
                    unit: deliverableType.defaultUnit || "NONE",
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: rider,
                    role: userRoles.rider,
                })
            );
            randomComment(newTask);
        });
    }
    // tasksDroppedOff
    const tasksDroppedOffCheck = await DataStore.query(models.Task, (task) =>
        task.or((task) =>
            task
                .status("eq", tasksStatus.droppedOff)
                .status("eq", tasksStatus.completed)
        )
    );
    if (tasksDroppedOffCheck.length === 0) {
        let timeOfCall = null;
        for (const i in _.range(16)) {
            const times = generateTimes(timeOfCall, 10);
            timeOfCall = times.timeOfCall;
            const requesterContact = generateRequesterContact();
            const rider = _.sample(availableRiders);
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status:
                        i < 8 ? tasksStatus.completed : tasksStatus.droppedOff,
                    priority,
                    timeOfCall,
                    pickUpLocation,
                    establishmentLocation: pickUpLocation,
                    timePickedUp: times.timePickedUp,
                    timePickedUpSenderName: faker.name.firstName(),
                    timeDroppedOff: times.timeDroppedOff,
                    timeDroppedOffRecipientName: faker.name.firstName(),
                    timeRiderHome: i < 8 ? times.timeCompleted : null,
                    dropOffLocation,
                    riderResponsibility: rider.riderResponsibility,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            const deliverableType = _.sample(availableDeliverables);
            await DataStore.save(
                new models.Deliverable({
                    deliverableType,
                    unit: deliverableType.defaultUnit || "NONE",
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: rider,
                    role: userRoles.rider,
                })
            );
            randomComment(newTask);
        }
    }
}
