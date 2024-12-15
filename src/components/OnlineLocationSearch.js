import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { useDispatch } from "react-redux";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";

import { useMapsLibrary } from "@vis.gl/react-google-maps";

const extractAddressComponents = (addressComponents) => {
    const address = {};
    addressComponents.forEach((component) => {
        if (component.types.includes("street_number")) {
            address.streetNumber = component.long_name;
        } else if (component.types.includes("route")) {
            address.line2 = component.long_name;
        } else if (component.types.includes("postal_town")) {
            address.town = component.long_name;
        } else if (component.types.includes("administrative_area_level_1")) {
            address.country = component.long_name;
        } else if (component.types.includes("administrative_area_level_2")) {
            address.county = component.long_name;
        } else if (component.types.includes("postal_code")) {
            address.postcode = component.long_name;
        }
    });
    return address;
};

const getPlacesAddressById = async (placeId) =>
    new Promise((resolve, reject) => {
        if (!placeId) reject("placeId not provided");

        try {
            new window.google.maps.places.PlacesService(
                document.createElement("div")
            ).getDetails(
                {
                    placeId,
                    fields: [
                        "address_components",
                        "formatted_phone_number",
                        "name",
                    ],
                },
                (details) => {
                    console.log(details);
                    let result = { contact: {} };
                    if (details) {
                        if (details.address_components) {
                            result = {
                                ...result,
                                ...extractAddressComponents(
                                    details.address_components
                                ),
                            };
                        }
                        if (details.formatted_phone_number) {
                            result.contact.telephoneNumber =
                                details.formatted_phone_number;
                        }
                        if (details.name) {
                            result.name = details.name;
                        }
                    }
                    return resolve(result);
                }
            );
        } catch (e) {
            reject(e);
        }
    });

const placesOptions = {
    componentRestrictions: { country: "uk" },
};

export default function OnlineLocationSearch({ onSelect }) {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState("");
    const [options, setOptions] = React.useState([]);
    const [autoCompleteService, setAutoCompleteService] = React.useState(null);
    const dispatch = useDispatch();

    const autoCompleteLibrary = useMapsLibrary("places");

    const fetch = React.useMemo(
        () =>
            throttle((request, callback) => {
                autoCompleteService?.getPlacePredictions(request, callback);
            }, 200),
        [autoCompleteService]
    );

    React.useEffect(() => {
        if (autoCompleteLibrary)
            setAutoCompleteService(
                new autoCompleteLibrary.AutocompleteService()
            );
    }, [autoCompleteLibrary]);

    React.useEffect(() => {
        let active = true;
        if (!autoCompleteService) {
            return undefined;
        }

        if (inputValue === "") {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue, ...placesOptions }, (results) => {
            if (active) {
                let newOptions = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch, autoCompleteService]);

    const onChange = React.useCallback(
        (event, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
            setValue(newValue);
            if (newValue) {
                getPlacesAddressById(newValue.place_id)
                    .then((result) => {
                        if (
                            newValue.types &&
                            newValue.types.includes("establishment")
                        ) {
                            result.line1 = result.name;
                        }
                        onSelect({
                            ...result,
                            googleMapsPlaceId: newValue.place_id,
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                        dispatch(
                            displayErrorNotification("Could not find address")
                        );
                    });
                console.log(newValue);
            }
        },
        [options, onSelect, dispatch]
    );

    return (
        <Autocomplete
            sx={{ width: 300 }}
            getOptionLabel={(option) =>
                typeof option === "string" ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={onChange}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    aria-label="search for places"
                    label="Search for places..."
                    fullWidth
                />
            )}
            renderOption={(props, option) => {
                const matches =
                    option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match) => [
                        match.offset,
                        match.offset + match.length,
                    ])
                );

                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Box
                                    component={LocationOnIcon}
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

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {
                                        option.structured_formatting
                                            .secondary_text
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
}
