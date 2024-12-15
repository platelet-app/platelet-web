import _ from "lodash";
import * as models from "../../../models";
import Papa from "papaparse";
import getTasksByTenantId from "./getTasksByTenantId";
import { Task, Role, CommentVisibility, TaskAssignee } from "../../../API";

const isDateValid = (date: Date): boolean => {
    const newDate = new Date(date);
    return !isNaN(newDate.getTime());
};

const isStartDateBeforeEndDate = (startDate: Date, endDate: Date): boolean => {
    return startDate.getTime() <= endDate.getTime();
};

const taskFields = {
    createdAt: "",
    timeOfCall: "",
    riderResponsibility: "",
    isRiderUsingOwnVehicle: "",
    priority: "",
    status: "",
    timePickedUp: "",
    timePickedUpSenderName: "",
    timeDroppedOff: "",
    timeDroppedOffRecipientName: "",
    timeRiderHome: "",
    timeRejected: "",
    timeCancelled: "",
};

const locationFields = {
    ward: "",
    line1: "",
    town: "",
    postcode: "",
    listed: "",
};

const itemFields = {
    label: "",
    count: "",
};

const requesterContactFields = {
    name: "",
    telephoneNumber: "",
};

const assigneeFields = {
    name: "",
    role: "",
};

const commentFields = {
    author: "",
    body: "",
};

function generateHeader(fields: any, prefix = "") {
    let keys = Object.keys(fields);
    if (prefix) {
        return keys.map((k) => `${prefix}_${k}`);
    } else {
        return keys;
    }
}

function generateCountedHeader(count: number, fields: any, prefix: string) {
    return _.range(count)
        .map((i) => {
            return Object.keys(fields).map((k) => `${prefix}_${i}_${k}`);
        })
        .flat();
}

async function generateCSV(data: (Task | null)[]) {
    const filteredNulls = data.filter((t) => !!t && !t?._deleted);
    const newData = filteredNulls.map((t) => {
        const isRiderUsingOwnVehicleBool = !!t?.isRiderUsingOwnVehicle;
        const isRiderUsingOwnVehicle = isRiderUsingOwnVehicleBool
            ? "TRUE"
            : "FALSE";

        return { ...t, isRiderUsingOwnVehicle };
    });
    const rows = [];
    const headers = [];
    const assigneesCount = newData.reduce((acc, task) => {
        const filtered = task?.assignees?.items?.filter((a) => !a?._deleted);
        if (filtered && filtered.length > acc) return filtered.length;
        else return acc;
    }, 0);
    const itemOffsetCount =
        [
            ...Object.keys(taskFields),
            ...Object.keys(locationFields),
            ...Object.keys(locationFields),
            ...Object.keys(requesterContactFields),
        ].length +
        assigneesCount * Object.keys(assigneeFields).length;

    const itemsCount = newData.reduce((acc, task) => {
        const filtered = task?.deliverables?.items?.filter((d) => !d?._deleted);
        if (filtered && filtered.length > acc) return filtered.length;
        else return acc;
    }, 0);

    const commentsOffsetCount =
        itemOffsetCount + itemsCount * Object.keys(itemFields).length;

    const commentsCount = newData.reduce((acc, task) => {
        const filtered = task?.comments?.items?.filter(
            (c) =>
                c?.visibility === models.CommentVisibility.EVERYONE &&
                !c?._deleted
        );
        if (filtered && filtered?.length > acc) return filtered?.length;
        else return acc;
    }, 0);

    headers.push(generateHeader(taskFields));
    headers.push(generateHeader(requesterContactFields, "requesterContact"));
    headers.push(generateHeader(locationFields, "pickUpLocation"));
    headers.push(generateHeader(locationFields, "dropOffLocation"));
    if (assigneesCount > 0) {
        headers.push(
            generateCountedHeader(assigneesCount, assigneeFields, "assignee")
        );
    }
    if (itemsCount > 0) {
        headers.push(generateCountedHeader(itemsCount, itemFields, "item"));
    }
    if (commentsCount > 0) {
        headers.push(
            generateCountedHeader(commentsCount, commentFields, "comment")
        );
    }
    console.log(headers);
    rows.push(headers.flat());
    console.log(rows);
    newData.forEach((item) => {
        let row: (string | number)[] = [];
        const {
            pickUpLocation,
            dropOffLocation,
            requesterContact,
            comments,
            deliverables,
            assignees,
            createdBy,
            ...rest
        } = item;
        Object.keys(taskFields).forEach((key) => {
            row.push(rest[key as keyof typeof taskFields] || "");
        });
        if (requesterContact)
            Object.keys(requesterContactFields).forEach((key) => {
                row.push(
                    requesterContact[
                        key as keyof typeof requesterContactFields
                    ] || ""
                );
            });
        else
            Object.values(requesterContactFields).forEach((value) => {
                row.push(value);
            });
        if (pickUpLocation)
            Object.keys(locationFields).forEach((key) => {
                if (key === "listed") {
                    row.push(pickUpLocation.listed === 1 ? "TRUE" : "FALSE");
                } else {
                    row.push(
                        pickUpLocation[key as keyof typeof locationFields] ||
                            locationFields[key as keyof typeof locationFields]
                    );
                }
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(value);
            });

        if (dropOffLocation)
            Object.keys(locationFields).forEach((key) => {
                if (key === "listed") {
                    row.push(dropOffLocation.listed === 1 ? "TRUE" : "FALSE");
                } else {
                    row.push(
                        dropOffLocation[key as keyof typeof locationFields] ||
                            locationFields[key as keyof typeof locationFields]
                    );
                }
            });
        else
            Object.values(locationFields).forEach((value) => {
                row.push(value);
            });

        // Sort by the role
        const filteredAssignees = assignees?.items
            ?.filter((a) => !a?._deleted)
            .sort((a, b) => {
                if (a && b) {
                    if (a.role < b.role) return -1;
                    if (a.role > b.role) return 1;
                    return 0;
                } else return 0;
            });

        if (filteredAssignees && filteredAssignees.length > 0) {
            filteredAssignees.forEach((item) => {
                Object.keys(assigneeFields).forEach((key) => {
                    if (key === "name") {
                        row.push(item?.assignee.name || assigneeFields.name);
                    } else if (key === "role") {
                        row.push(item?.role || assigneeFields.role);
                    }
                });
            });
        }

        const filteredDeliverables = deliverables?.items?.filter(
            (d) => !d?._deleted
        );

        if (filteredDeliverables && filteredDeliverables.length > 0) {
            if (row.length !== itemOffsetCount) {
                _.range(itemOffsetCount - row.length).forEach(() => {
                    row.push("");
                });
            }
            filteredDeliverables.forEach((item) => {
                Object.keys(itemFields).forEach((key) => {
                    if (key === "label") {
                        row.push(
                            item?.deliverableType?.label || itemFields[key]
                        );
                    } else {
                        row.push(item?.count || itemFields?.count);
                    }
                });
            });
        }

        const filteredComments = comments?.items?.filter(
            (c) =>
                c && !c._deleted && c?.visibility === CommentVisibility.EVERYONE
        );

        if (filteredComments && filteredComments.length > 0) {
            if (row.length !== commentsOffsetCount) {
                _.range(commentsOffsetCount - row.length).forEach(() => {
                    row.push("");
                });
            }
            filteredComments?.forEach((comment) => {
                Object.keys(commentFields).forEach((key) => {
                    if (key === "author") {
                        row.push(
                            comment?.author?.displayName || commentFields[key]
                        );
                    } else {
                        row.push(comment?.body || commentFields.body);
                    }
                });
            });
        }

        rows.push(row);
    });
    return Papa.unparse(rows);
}

export default async function generateReportBasic(
    userId: string,
    role: Role | "ALL",
    tenantId: string,
    startDate: Date | null = null,
    endDate: Date | null = null
) {
    if (endDate && !isDateValid(endDate)) {
        console.log("end date is not valid");
        return;
    }
    if (startDate && !isDateValid(startDate)) {
        console.log("start date is not valid");
        return;
    }
    if (userId && role === "ALL") {
        throw new Error("user needs a role");
    } else if (!userId && role !== "ALL") {
        throw new Error("userId is null");
    }
    const actualEndDate = endDate ? new Date(endDate) : null;
    const actualStartDate = startDate ? new Date(startDate) : null;
    const startDateCopy = actualStartDate ? new Date(actualStartDate) : null;
    const endDateCopy = actualEndDate ? new Date(actualEndDate) : null;
    if (actualStartDate) {
        actualStartDate.setUTCHours(0, 0, 0, 0);
        // sometimes changing the time changes the date, so we set it back
        if (startDateCopy) actualStartDate.setDate(startDateCopy.getDate());
    }
    // if we use ALL we are using graphql and createdAt, so we add a day to the end date
    // and set the time to 00
    if (actualEndDate) {
        actualEndDate.setUTCHours(0, 0, 0, 0);
        if (endDateCopy) actualEndDate.setDate(endDateCopy.getDate() + 1);
    }
    console.log("get tasks", actualStartDate, actualEndDate);
    if (
        actualStartDate &&
        actualEndDate &&
        !isStartDateBeforeEndDate(actualStartDate, actualEndDate)
    ) {
        throw new Error("start date is not before end date");
    }
    if (!actualEndDate || !actualStartDate) {
        throw new Error("start date or end date is null");
    }

    let tasks = await getTasksByTenantId(
        tenantId,
        actualStartDate,
        actualEndDate
    );
    if (userId && role !== "ALL") {
        tasks = tasks.filter((t) => {
            if (t?.assignees?.items) {
                return t.assignees.items.some(
                    (a: TaskAssignee | null) =>
                        a?.assignee.id === userId &&
                        a?.role === role &&
                        !a?._deleted
                );
            } else return false;
        });
    }

    return generateCSV(tasks);
}

// callback code that may be useful
/*let count = 0;
    finalTasks = await Promise.all(
        finalTasks.map((t) =>
            new Promise((resolve, reject) => {
                const comments = commentsAll.filter((c) => c.parentId === t.id);
                const items = deliverables.filter(
                    (d) => d.task && d.task.id === t.id
                );
                const assignees = assignments.filter(
                    (assignment) =>
                        assignment.task && assignment.task.id === t.id
                );
                resolve({ ...t, comments, items, assignees });
            })
                .then((result) => {
                    count++;
                    if (progressCallback) {
                        progressCallback((count * 100) / finalTasks.length);
                    }
                    return result;
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                })
        )
    );
    */
