import {
    Divider,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import GetError from "../../../ErrorComponents/GetError";
import { useDispatch, useSelector } from "react-redux";
import {
    dataStoreModelSyncedStatusSelector,
    taskAssigneesSelector,
} from "../../../redux/Selectors";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import TaskActionConfirmationDialogContents from "./TaskActionConfirmationDialogContents";
import TimePicker from "./TimePicker";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { saveTaskTimeWithKey } from "../utilities";
import { tasksStatus, userRoles } from "../../../apiConsts";
import { useAssignmentRole } from "../../../hooks/useAssignmentRole";
import determineTaskStatus from "../../../utilities/determineTaskStatus";
import TimeAndNamePicker from "./TimeAndNamePicker";

const fields = {
    timePickedUp: "Picked up",
    timeDroppedOff: "Delivered",
    timeCancelled: "Cancelled",
    timeRejected: "Rejected",
    timeRiderHome: "Rider home",
};

function lowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
const getHumanReadableTimeLabel = (key) => {
    return `Time ${lowerCaseFirstLetter(fields[key])}`;
};

function TaskActions(props) {
    const [state, setState] = useState([]);
    const [task, setTask] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [errorState, setErrorState] = useState(null);
    const taskAssignees = useSelector(taskAssigneesSelector).items;
    const [confirmationKey, setConfirmationKey] = useState(null);
    const [editKey, setEditKey] = useState(null);

    const taskObserver = useRef({ unsubscribe: () => {} });
    const dispatch = useDispatch();
    const { classes } = dialogCardStyles();
    const taskModelsSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Task;

    const currentUserRole = useAssignmentRole(props.taskId);
    const hasFullPermissions = [
        userRoles.rider,
        userRoles.admin,
        userRoles.coordinator,
    ].includes(currentUserRole);

    const errorMessage = "Sorry, something went wrong";

    const stateChecker = () => {
        const states = state.reduce((acc, key) => {
            acc[key] = state.includes(key);
            return acc;
        }, {});
        if (!states.timePickedUp) {
            if (states.timeDroppedOff || states.timeRiderHome) {
                return false;
            }
        } else if (!states.timeDroppedOff) {
            if (states.timeRiderHome) {
                return false;
            }
        }
        return true;
    };

    function onClickToggle(key) {
        setConfirmationKey(key);
    }

    function onClickEdit(key) {
        setEditKey(key);
    }
    function onCancelEdit() {
        setEditKey(null);
    }

    async function setTimeWithKey(key, value) {
        setIsPosting(true);
        setEditKey(null);
        try {
            const updatedTask = await saveTaskTimeWithKey(
                key,
                value,
                props.taskId,
                taskAssignees
            );
            setTask(updatedTask);
            setIsPosting(false);
        } catch (error) {
            console.log(error);
            setIsPosting(false);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function saveValues(values) {
        setIsPosting(true);
        setConfirmationKey(null);
        try {
            const existingTask = await DataStore.query(
                models.Task,
                props.taskId
            );
            const riderAssignees = taskAssignees.filter(
                (assignee) => assignee.role === userRoles.rider
            );
            const status = await determineTaskStatus(
                { ...existingTask, ...values },
                riderAssignees
            );
            const updatedTask = await DataStore.save(
                models.Task.copyOf(existingTask, (upd) => {
                    upd.status = status;
                    for (const key in values) {
                        upd[key] = values[key];
                    }
                })
            );
            setTask(updatedTask);
        } catch (e) {
            console.log(e);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        } finally {
            setIsPosting(false);
            setEditKey(null);
        }
    }

    function calculateState() {
        if (!task) return;
        const result = Object.keys(fields).filter((key) => {
            return !!task[key];
        });
        setState(result);
    }

    useEffect(calculateState, [task]);

    const getTaskAndUpdateState = React.useCallback(async (taskId) => {
        try {
            const task = await DataStore.query(models.Task, taskId);
            if (!task) throw new Error("Task not found");
            setTask(task);
            setIsFetching(false);
            taskObserver.current.unsubscribe();
            taskObserver.current = DataStore.observe(
                models.Task,
                taskId
            ).subscribe(async ({ opType, element }) => {
                if (["INSERT", "UPDATE"].includes(opType)) {
                    setTask(element);
                } else if (opType === "DELETE") {
                    // just disable the buttons if the task is deleted
                    setIsFetching(true);
                }
            });
        } catch (e) {
            setIsFetching(false);
            console.log(e);
            setErrorState(e);
        }
    }, []);

    useEffect(
        () => getTaskAndUpdateState(props.taskId),
        [props.taskId, taskModelsSynced, getTaskAndUpdateState]
    );

    useEffect(() => () => taskObserver.current.unsubscribe(), []);

    function checkDisabled(key) {
        if (!stateChecker()) return false;
        if (!hasFullPermissions || task.status === tasksStatus.pending)
            return true;
        const stopped =
            state.includes("timeCancelled") || state.includes("timeRejected");
        if (key === "timeDroppedOff")
            return (
                state.includes("timeRiderHome") ||
                !state.includes("timePickedUp") ||
                stopped
            );
        else if (key === "timePickedUp") {
            const assigneeCheck = taskAssignees.filter(
                (ta) =>
                    ta.role === userRoles.rider &&
                    ta.task &&
                    ta.task.id === props.taskId
            );

            return (
                assigneeCheck.length === 0 ||
                state.includes("timeDroppedOff") ||
                stopped
            );
        } else if (key === "timeRiderHome") {
            if (task && task.status === tasksStatus.new) return true;
            if (state.includes("timeRiderHome")) return false;
            return !state.includes("timeDroppedOff");
        } else if (key === "timeRejected") {
            if (state.includes("timeRejected")) return false;
            return (
                (state.includes("timePickedUp") &&
                    state.includes("timeDroppedOff")) ||
                stopped
            );
        } else if (key === "timeCancelled") {
            if (state.includes("timeCancelled")) return false;
            return (
                (state.includes("timePickedUp") &&
                    state.includes("timeDroppedOff")) ||
                stopped
            );
        } else return false;
    }

    if (errorState) {
        return <GetError />;
    } else {
        return (
            <>
                <Paper className={classes.root}>
                    <Stack direction={"column"} spacing={2}>
                        <Typography variant={"h6"}>Actions</Typography>
                        <Divider />
                        <Stack
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                            direction="row"
                        >
                            <ToggleButtonGroup
                                value={state}
                                orientation="vertical"
                                aria-label="task actions"
                            >
                                {Object.entries(fields).map(([key, value]) => {
                                    return (
                                        <ToggleButton
                                            data-cy={`task-${key}-button`}
                                            sx={{
                                                paddingTop: 1.5,
                                                paddingBottom: 1.5,
                                            }}
                                            key={key}
                                            disabled={
                                                isPosting ||
                                                isFetching ||
                                                checkDisabled(key)
                                            }
                                            aria-disabled={
                                                isPosting ||
                                                isFetching ||
                                                checkDisabled(key)
                                            }
                                            aria-label={value}
                                            value={key}
                                            onClick={() => onClickToggle(key)}
                                        >
                                            {state.includes(key) ? (
                                                <CheckBoxIcon />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon />
                                            )}
                                        </ToggleButton>
                                    );
                                })}
                            </ToggleButtonGroup>
                            <Stack sx={{ width: "100%" }} direction="column">
                                {Object.entries(fields).map(([key, value]) => {
                                    const textfieldNameLabel =
                                        key === "timePickedUp"
                                            ? "Sender name"
                                            : "Recipient name";
                                    const disabled =
                                        isPosting ||
                                        isFetching ||
                                        checkDisabled(key);

                                    const tooltipKey =
                                        key === "timePickedUp"
                                            ? "timePickedUpSenderName"
                                            : "timeDroppedOffRecipientName";

                                    const label =
                                        getHumanReadableTimeLabel(key);

                                    let picker = (
                                        <TimePicker
                                            basicTime
                                            key={editKey}
                                            onChange={(newValue) =>
                                                setTimeWithKey(key, newValue)
                                            }
                                            onCancelEdit={onCancelEdit}
                                            label={label}
                                            editMode={editKey === key}
                                            onClickEdit={() => onClickEdit(key)}
                                            disableClear
                                            disableUnsetMessage
                                            time={task && task[key]}
                                            hideEditIcon={!hasFullPermissions}
                                        />
                                    );
                                    if (
                                        [
                                            "timePickedUp",
                                            "timeDroppedOff",
                                        ].includes(key)
                                    ) {
                                        picker = (
                                            <TimeAndNamePicker
                                                basicTime
                                                onChange={(newValue) => {
                                                    const { name, time } =
                                                        newValue;
                                                    const isoString = time
                                                        ? time.toISOString()
                                                        : null;
                                                    const nameKey =
                                                        key === "timePickedUp"
                                                            ? "timePickedUpSenderName"
                                                            : "timeDroppedOffRecipientName";
                                                    saveValues({
                                                        [key]: isoString,
                                                        [nameKey]: name,
                                                    });
                                                }}
                                                onCancelEdit={onCancelEdit}
                                                name={task && task[tooltipKey]}
                                                editMode={editKey === key}
                                                onClickEdit={() =>
                                                    onClickEdit(key)
                                                }
                                                label={label}
                                                nameLabel={textfieldNameLabel}
                                                disableClear
                                                disabled={isPosting}
                                                disableUnsetMessage
                                                time={task && task[key]}
                                                hideEditIcon={
                                                    !hasFullPermissions
                                                }
                                            />
                                        );
                                    }
                                    return (
                                        <Stack
                                            key={`${key}-text-entry`}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            direction="row"
                                        >
                                            <Typography
                                                onClick={() => {
                                                    if (disabled) return;
                                                    onClickToggle(key);
                                                }}
                                                sx={{
                                                    paddingTop: 1.5,
                                                    paddingBottom: 1.5,
                                                    cursor: disabled
                                                        ? "default"
                                                        : "pointer",
                                                    color: disabled
                                                        ? "gray"
                                                        : "text.primary",
                                                }}
                                            >
                                                {value.toUpperCase()}
                                            </Typography>
                                            {task && picker}
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
                <TaskActionConfirmationDialogContents
                    onConfirmation={saveValues}
                    key={confirmationKey}
                    nullify={state.includes(confirmationKey)}
                    timeKey={confirmationKey}
                    taskId={props.taskId}
                    onClose={() => setConfirmationKey(null)}
                />
            </>
        );
    }
}

TaskActions.propTypes = {
    taskId: PropTypes.string.isRequired,
};

export default TaskActions;
