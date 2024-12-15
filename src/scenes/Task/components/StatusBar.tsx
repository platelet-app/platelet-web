import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Chip, Paper, Stack } from "@mui/material";
import { taskStatusHumanReadable } from "../../../utilities";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { useDispatch, useSelector } from "react-redux";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { dataStoreModelSyncedStatusSelector } from "../../../redux/Selectors";
import generateClipboardTextFromTask from "../../../utilities/generateClipboardTextFromTask";
import { copyStringToClipboard } from "../../../utilities/copyStringToClipboard";
import CopyFailedDialog from "../../../components/CopyFailedDialog";
const colourBarPercent = "90%";

const generateClass = (theme: any, status: models.TaskStatus) => {
    const defaults = {
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 18,
        marginRight: 10,
        display: "flex",
        width: "100%",
        maxWidth: 825,
        borderRadius: 10,
        italic: {
            fontStyle: "italic",
        },
    };
    if (status) {
        return {
            ...defaults,
            background: `linear-gradient(0deg,
        ${theme.palette.background.paper}
        ${colourBarPercent},
        ${theme.palette.background.paper}
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]}
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]} 100%)`,
        };
    } else {
        return {
            ...defaults,
            background:
                theme.palette.mode === "dark"
                    ? theme.palette.background.paper
                    : theme.palette.primary.main,
        };
    }
};
// @ts-ignore
const useStyles = makeStyles()((theme, { status }) => {
    const root = generateClass(theme, status);
    return {
        root,
        statusText: {
            fontWeight: "bold",
            color: theme.palette.mode === "dark" ? "white" : "black",
        },
        items: {
            marginTop: 5,
        },
    };
});

type StatusBarProps = {
    taskId?: string;
};

const StatusBar: React.FC<StatusBarProps> = ({ taskId }) => {
    const [copied, setCopied] = useState<null | Boolean>(null);
    const [copyText, setCopyText] = useState<string | null>("");
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const dispatch = useDispatch();
    const taskModelsSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Task;
    const taskObserver = useRef({ unsubscribe: () => {} });
    const [status, setStatus] = useState<models.TaskStatus | null>(null);
    // @ts-ignore
    const { classes } = useStyles({ status });

    const getTask = React.useCallback(async (taskId) => {
        try {
            const task = await DataStore.query(models.Task, taskId);
            taskObserver.current = DataStore.observe(
                models.Task,
                taskId
            ).subscribe(({ element }) => {
                setStatus(element.status as models.TaskStatus);
            });
            if (task) setStatus(task.status as models.TaskStatus);
        } catch (e) {
            console.log(e);
        }
    }, []);
    useEffect(() => {
        getTask(taskId);
    }, [taskId, taskModelsSynced, getTask]);
    async function copyToClipboard() {
        if (!taskId) {
            dispatch(displayErrorNotification("Copy failed."));
            return;
        }
        try {
            const taskResult = await DataStore.query(models.Task, taskId);
            if (!taskResult) throw new Error("Task not found.");
            const deliverablesResult = await DataStore.query(
                models.Deliverable
            );
            const deliverables = deliverablesResult.filter(
                (d) => d.task && d.task.id === taskResult.id
            );
            const result = { ...taskResult, deliverables };
            const textToCopy = generateClipboardTextFromTask(result);
            try {
                copyStringToClipboard(textToCopy).then(
                    () => {
                        setCopied(true);
                    },
                    () => {
                        setCopyText(textToCopy);
                    }
                );
            } catch (e) {
                setCopyText(textToCopy);
            }
        } catch (e) {
            console.log(e);
            setCopied(false);
        }
    }
    let copyLabel = "Copy to clipboard";
    if (copied !== null && copied) {
        copyLabel = "Copy successful!";
    } else if (copied !== null && !copied) {
        copyLabel = "Copy failed!";
    }
    let copyColor: "success" | "secondary" | "primary" = "primary";
    if (copied !== null && copied) {
        copyColor = "success";
    } else if (copied !== null && !copied) {
        copyColor = "secondary";
    }
    return (
        <Stack sx={{ paddingTop: 1, paddingBottom: 1 }} direction="row">
            <Paper className={classes.root}>
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    sx={{ width: "100%" }}
                >
                    <Typography
                        data-cy="task-status"
                        className={classes.statusText}
                    >
                        {taskStatusHumanReadable(status)}
                    </Typography>
                    <Chip
                        onClick={copyToClipboard}
                        variant={copied === null ? "outlined" : "filled"}
                        color={copyColor}
                        sx={{ marginRight: isSm ? 0 : 2 }}
                        label={copyLabel}
                    />
                </Stack>
            </Paper>
            <CopyFailedDialog
                text={copyText || ""}
                onClose={() => setCopyText(null)}
            />
        </Stack>
    );
};

export default StatusBar;
