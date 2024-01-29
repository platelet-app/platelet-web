import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { makeStyles } from "tss-react/mui";
import { TextFieldUncontrolled } from "../../../components/TextFields";

const useStyles = makeStyles()((theme) => ({
    text: {
        maxWidth: 300,
        [theme.breakpoints.down("lg")]: {
            maxWidth: 250,
        },
    },
    enabled: {
        background:
            theme.palette.mode === "dark" ? "rgb(70, 70, 70)" : "yellow",
    },
    label: {
        fontStyle: "italic",
        color: "gray",
        "&:hover": {
            background:
                theme.palette.mode === "dark"
                    ? "rgb(100, 100, 100)"
                    : "rgb(242, 242, 242)",
        },
    },
    hoverHighlight: {
        "&:hover": {
            background:
                theme.palette.mode === "dark"
                    ? "rgb(100, 100, 100)"
                    : "rgb(242, 242, 242)",
        },
    },
}));

type ClickableDeliverableCountProps = {
    value?: string | null;
    disabled?: boolean;
    label?: string | null;
    onChange?: (value: string) => void;
    tel?: boolean;
    onFinished?: (value: string) => void;
    textFieldProps?: object;
};

const ClickableDeliverableCount: React.FC<ClickableDeliverableCountProps> = ({
    value = "1",
    disabled = false,
    label = "",
    onChange,
    tel = false,
    onFinished,
    textFieldProps = {},
}) => {
    const [editMode, setEditMode] = useState(false);
    const [state, setState] = useState("");
    const firstValue = useRef(value);
    const { classes, cx } = useStyles();

    function handleChange(e: any) {
        if (onChange) onChange(e.target.value);
        setState(e.target.value);
    }

    function onFinishedEntry(ev: any) {
        setEditMode(false);
        const { value } = ev.target;
        if (value) {
            if (onFinished) onFinished(ev.target.value);
            firstValue.current = ev.target.value;
        } else {
            setState(firstValue.current || "1");
        }
    }

    function toggleEditMode() {
        if (!disabled) {
            setEditMode(!editMode);
        }
    }

    useEffect(() => {
        firstValue.current = value || "";
        setState(value || "");
    }, [value]);

    const newLabel = disabled && !label ? "" : label || "Click to edit";

    if (editMode) {
        return (
            <TextFieldUncontrolled
                {...textFieldProps}
                margin="dense"
                variant="standard"
                inputProps={{
                    "aria-label": newLabel,
                }}
                className={cx(classes.label, classes.text)}
                tel={tel}
                onPressEnter={(ev: any) => {
                    onFinishedEntry(ev);
                    setEditMode(false);
                    ev.stopPropagation();
                }}
                onPressEscape={(ev: any) => {
                    ev.stopPropagation();
                    handleChange({
                        target: { value: firstValue.current },
                    });
                    setEditMode(false);
                }}
                autoFocus={true}
                onBlur={(ev: any) => onFinishedEntry(ev)}
                value={state}
                onChange={handleChange}
            />
        );
    } else {
        return (
            <Typography
                noWrap
                aria-label={label || "Click to edit"}
                className={cx(
                    classes.hoverHighlight,
                    classes.enabled,
                    classes.text
                )}
                align={"right"}
                onClick={toggleEditMode}
            >
                {state}
            </Typography>
        );
    }
};

export default ClickableDeliverableCount;
