import React, { useEffect, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { matchSorter } from "match-sorter";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";
import { Geo } from "aws-amplify";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import _ from "lodash";
import { Box, Divider, Grid } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

const filterOptions = (options, { inputValue }) => {
    const onlineOptions = options.filter((option) => !option.id);
    const notOnlineOptions = options.filter((option) => option.id);
    const matches = matchSorter(notOnlineOptions, inputValue, {
        keys: ["name"],
    });
    if (onlineOptions.length === 0) {
        return matches;
    } else if (matches.length === 0) {
        return onlineOptions;
    } else {
        return [...matches, null, ...onlineOptions];
    }
};

function FavouriteLocationsSelect(props) {
    const [availableLocations, setAvailableLocations] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const locationModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Location;
    const onSelect = (event, selectedItem) => {
        let result = selectedItem;
        // if there is no id then it is an online search result
        if (selectedItem && !selectedItem?.id) {
            const line1 = `${selectedItem?.addressNumber || ""} ${
                selectedItem?.street || ""
            }`;
            const line2 = selectedItem?.neighborhood;
            const town = selectedItem?.municipality;
            const county = selectedItem?.subRegion;
            const country = selectedItem?.country;
            const postcode = selectedItem?.postalCode;
            result = {
                line1,
                line2,
                town,
                county,
                country,
                postcode,
                listed: 0,
            };
        }
        props.onSelect(result);
    };
    const debouncedSearch = React.useRef(() => {});

    async function getLocations() {
        try {
            const locations = await DataStore.query(models.Location, (l) =>
                l.listed("eq", 1).disabled("ne", 1)
            );
            setAvailableLocations(locations);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getLocations();
    }, [locationModelSynced]);

    debouncedSearch.current = React.useMemo(() => {
        return _.debounce(async (searchTerm) => {
            if (process.env.REACT_APP_DEMO_MODE === "true") return;
            if (searchTerm.length > 2) {
                const result = await Geo.searchByText(searchTerm, {
                    countries: ["GBR"],
                });
                setAvailableLocations((prevState) => [
                    ...prevState.filter((location) => location.id),
                    ...result,
                ]);
            } else {
                setAvailableLocations((prevState) =>
                    prevState.filter((location) => location.id)
                );
            }
        }, 500);
    }, []);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        if (props.online) {
            debouncedSearch.current(newInputValue);
        }
    };

    return (
        <Autocomplete
            fullWidth
            aria-label={props.label}
            filterOptions={filterOptions}
            options={availableLocations}
            getOptionLabel={(option) => option?.name || option?.label || ""}
            size={props.size}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    aria-label={props.label}
                    sx={props.sx}
                    label={props.label}
                    variant="outlined"
                    margin="none"
                />
            )}
            renderOption={(props, option) => {
                if (!option) {
                    return <Divider sx={{ marginBottom: 1 }} />;
                }
                const label = option.name || option.label;
                const matches = match(label, inputValue);
                const labelNoCommas = label.replace(/,/g, "");
                const parts = parse(labelNoCommas, matches);

                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Box
                                    component={
                                        option.id ? LocationOnIcon : PublicIcon
                                    }
                                    sx={{ color: "text.secondary", mr: 2 }}
                                />
                            </Grid>
                            <Grid item xs>
                                {parts.map((part, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            fontWeight: part.highlight
                                                ? 700
                                                : 400,
                                        }}
                                    >
                                        {part.text}
                                    </span>
                                ))}
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
            onChange={onSelect}
        />
    );
}

FavouriteLocationsSelect.propTypes = {
    onSelect: PropTypes.func,
    label: PropTypes.string,
    size: PropTypes.string,
    sx: PropTypes.object,
    online: PropTypes.bool,
};
FavouriteLocationsSelect.defaultProps = {
    onSelect: () => {},
    label: "Search locations...",
    size: "small",
    sx: {},
    online: false,
};

export default FavouriteLocationsSelect;
