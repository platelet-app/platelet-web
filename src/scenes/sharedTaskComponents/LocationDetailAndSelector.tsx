import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import LabelItemPair from "../../components/LabelItemPair";
import ClickableTextField from "../../components/ClickableTextField";
import FavouriteLocationsSelect from "../../components/FavouriteLocationsSelect";
import { makeStyles } from "tss-react/mui";
import Divider from "@mui/material/Divider";
import { Box, Link, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { encodeUUID } from "../../utilities";
import ClearButtonWithConfirmation from "../../components/ClearButtonWithConfirmation";
import * as models from "../../models";
import WhatThreeWords from "./WhatThreeWords";

const useStyles = makeStyles()((theme) => ({
    root: {},
    label: {
        width: "90%",
        fontWeight: "bold",
    },
    separator: {
        height: 10,
    },
    hint: {
        fontStyle: "italic",
        fontSize: 15,
        color: "gray",
        "&:hover": {
            color: theme.palette.text.primary,
        },
    },
}));

type InitialStateType = {
    address: {
        what3words?: string | null;
        ward?: string | null;
        line1?: string | null;
        line2?: string | null;
        town?: string | null;
        county?: string | null;
        postcode?: string | null;
    };
    contact: {
        telephoneNumber?: string | null;
        emailAddress?: string | null;
        name?: string | null;
    };
};

const initialState: InitialStateType = {
    address: {
        what3words: "",
        ward: "",
        line1: "",
        line2: "",
        town: "",
        county: "",
        postcode: "",
    },
    contact: {
        telephoneNumber: "",
        emailAddress: "",
        name: "",
    },
};

const addressFields = {
    what3words: "what3words",
    ward: "Ward",
    line1: "Line one",
    line2: "Line two",
    town: "Town",
    county: "County",
    country: "Country",
    postcode: "Postcode",
};

const contactFields = {
    name: "Name",
    telephoneNumber: "Telephone",
};

type LocationDetailAndSelectorProps = {
    label?: string;
    location: models.Location | null;
    onSelectPreset?: (selection: models.Location) => any;
    className?: string;
    displayPresets?: boolean;
    onChange?: (...args: any[]) => any;
    onChangeContact?: (...args: any[]) => any;
    disableClear?: boolean;
    onClear?: () => void;
    noLink?: boolean;
    editMode?: boolean;
    disabled?: boolean;
};

const LocationDetailAndSelector: React.FC<LocationDetailAndSelectorProps> = ({
    label = "Search locations",
    location = null,
    onSelectPreset,
    className,
    onChange,
    onChangeContact,
    disableClear = false,
    onClear,
    noLink = false,
    editMode = true,
    displayPresets = true,
    disabled = false,
}) => {
    const { classes } = useStyles();
    const [state, setState] = useState(initialState);

    function updateStateFromProps() {
        if (location) {
            let result = { ...initialState };
            if (location) {
                result = {
                    ...result,
                    address: { ...location },
                };
            }
            if (location.contact) {
                result = {
                    ...result,
                    contact: { ...result.contact, ...location.contact },
                };
            }
            setState(result);
        } else {
            setState(initialState);
        }
    }
    useEffect(updateStateFromProps, [location]);
    const presetName = location && location.name ? location.name : "";
    const locationLink =
        location && location.id ? `/location/${encodeUUID(location.id)}` : "";
    let locationTitle = <></>;
    const theme = useTheme();
    if (location && !noLink && !!location.listed) {
        locationTitle = (
            <Link
                sx={{
                    textDecoration: "none",
                    color: theme.palette.text.primary,
                    textDecorationColor: theme.palette.text.primary,
                    "&:hover": {
                        textDecoration: "underline",
                    },
                }}
                href={locationLink}
            >
                <Typography noWrap className={classes.label}>
                    {presetName}
                </Typography>
            </Link>
        );
    } else if (location && (noLink || !!!location.listed)) {
        locationTitle = (
            <Typography noWrap className={classes.label}>
                {presetName}
            </Typography>
        );
    }
    if (presetName.length > 35) {
        locationTitle = <Tooltip title={presetName}>{locationTitle}</Tooltip>;
    }
    const presetSelect = displayPresets ? (
        <Stack
            justifyContent={"space-between"}
            alignItems={"center"}
            direction={"row"}
        >
            {!location || editMode ? (
                <FavouriteLocationsSelect online onSelect={onSelectPreset} />
            ) : (
                <></>
            )}
        </Stack>
    ) : (
        <></>
    );
    return (
        <Box className={classes.root}>
            <Stack spacing={1} className={className} direction={"column"}>
                {!!!location && (
                    <Typography className={classes.hint}>
                        Search the directory or click a field to enter manually
                    </Typography>
                )}
                {presetSelect}
                {!editMode && locationTitle && locationTitle}

                {!editMode && state?.address && (
                    <Typography>
                        {Object.keys(addressFields)
                            .filter((v) => !["what3words"].includes(v))
                            .map(
                                (key) =>
                                    state.address[
                                        key as keyof typeof state.address
                                    ]
                            )
                            .filter((v) => v)
                            .join(", ")}
                    </Typography>
                )}

                {!editMode && state?.address?.what3words && (
                    <WhatThreeWords words={state.address.what3words} />
                )}
                {!editMode &&
                    (state?.contact?.name ||
                        state?.contact?.telephoneNumber) && (
                        <>
                            <Divider />
                            <Box>
                                {state?.contact?.name && (
                                    <LabelItemPair label="Name">
                                        <Typography>
                                            {state.contact.name}
                                        </Typography>
                                    </LabelItemPair>
                                )}
                                {state?.contact?.telephoneNumber && (
                                    <LabelItemPair label="Telephone">
                                        <Typography>
                                            {state.contact.telephoneNumber}
                                        </Typography>
                                    </LabelItemPair>
                                )}
                            </Box>
                        </>
                    )}
                {editMode && (
                    <Stack direction={"column"}>
                        {Object.entries(addressFields).map(([key, label]) => {
                            return (
                                <LabelItemPair key={key} label={label}>
                                    <ClickableTextField
                                        label={label}
                                        disabled={!editMode}
                                        onFinished={(v) => {
                                            setState((prevState) => ({
                                                ...prevState,
                                                address: {
                                                    ...state.address,
                                                    [key]: v,
                                                },
                                            }));
                                            if (onChange)
                                                onChange({ [key]: v });
                                        }}
                                        value={
                                            state.address[
                                                key as keyof typeof state.address
                                            ]
                                        }
                                    />
                                </LabelItemPair>
                            );
                        })}
                    </Stack>
                )}
                {editMode && (
                    <Stack direction={"column"}>
                        {Object.entries(contactFields).map(([key, label]) => {
                            return (
                                <LabelItemPair key={key} label={label}>
                                    <ClickableTextField
                                        label={label}
                                        tel={key === "telephoneNumber"}
                                        disabled={!editMode}
                                        onFinished={(v) => {
                                            setState((prevState) => ({
                                                ...prevState,
                                                contact: {
                                                    ...state.contact,
                                                    [key]: v,
                                                },
                                            }));
                                            if (onChangeContact)
                                                onChangeContact({
                                                    [key]: v,
                                                });
                                        }}
                                        value={
                                            state.contact[
                                                key as keyof typeof state.contact
                                            ]
                                        }
                                    />
                                </LabelItemPair>
                            );
                        })}
                    </Stack>
                )}
                {editMode && <Divider />}
                <Box
                    sx={{
                        alignContent: "right",
                        display: "flex",
                        marginTop: 1,
                    }}
                >
                    {location && !disableClear && editMode && (
                        <ClearButtonWithConfirmation
                            disabled={disabled}
                            onClear={onClear}
                        >
                            <Typography>
                                Are you sure you want to clear the {label}{" "}
                                location?
                            </Typography>
                        </ClearButtonWithConfirmation>
                    )}
                </Box>
            </Stack>
        </Box>
    );
};

export default LocationDetailAndSelector;
