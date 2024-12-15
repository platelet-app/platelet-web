import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import ConfirmationDialog from "./ConfirmationDialog";
import PropTypes from "prop-types";

function ClearButtonWithConfirmation(props) {
    const [open, setOpen] = useState(false);

    function onClick() {
        setOpen(true);
    }

    function onSelect() {
        props.onClear();
        setOpen(false);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <Box>
            <ConfirmationDialog
                onConfirmation={onSelect}
                dialogTitle={"Are you sure?"}
                onClose={handleClose}
                onCancel={handleClose}
                open={open}
            >
                {props.children}
            </ConfirmationDialog>
            <Button
                sx={{ color: "red", borderColor: "red", width: "25%" }}
                disabled={props.disabled}
                onClick={onClick}
                variant={"outlined"}
                size="small"
            >
                Clear
            </Button>
        </Box>
    );
}

ClearButtonWithConfirmation.propTypes = {
    disabled: PropTypes.bool,
    onClear: PropTypes.func,
    children: PropTypes.any,
};

ClearButtonWithConfirmation.defaultProps = {
    disabled: false,
    onClear: () => {},
};

export default ClearButtonWithConfirmation;
