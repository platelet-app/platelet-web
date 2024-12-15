import * as React from "react";
import { Box, Typography, List, ListItem, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type MapDirectionsDetailsProps = {
    leg: google.maps.DirectionsLeg;
    routes: google.maps.DirectionsRoute[];
    selected: google.maps.DirectionsRoute;
    onSelectRouteIndex: (index: number) => void;
    routeIndex: number;
};

const MapDirectionsDetails: React.FC<MapDirectionsDetailsProps> = ({
    leg,
    routes,
    selected,
    onSelectRouteIndex,
    routeIndex,
}) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <Box
            sx={{
                padding: 2,
                borderBottomRightRadius: "1em",
                borderBottomLeftRadius: "1em",
                position: "absolute",
                top: 0,
                paddingRight: 6,
                right: 80,
                background:
                    theme.palette.mode === "dark"
                        ? "rgba(0,0,0,0.6)"
                        : "rgba(255,255,255,0.8)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <div>
                {!isSm && (
                    <Typography variant="h4">{selected.summary}</Typography>
                )}
                <Typography>
                    {leg.start_address.split(",")[0]} to{" "}
                    {leg.end_address.split(",")[0]}
                </Typography>
                <Typography>Distance: {leg.distance?.text}</Typography>
                <Typography>Duration: {leg.duration?.text}</Typography>
            </div>
            {!isSm && (
                <div>
                    <Typography variant="h4">Other Routes</Typography>
                    <List>
                        {routes.map((route, index) => (
                            <ListItem
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: "1em",
                                    background:
                                        index === routeIndex
                                            ? "rgba(0,0,0,0.3)"
                                            : "transparent",
                                    "&:hover": {
                                        background: "rgba(0,0,0,0.3)",
                                    },
                                }}
                                onClick={() => onSelectRouteIndex(index)}
                                key={route.summary}
                            >
                                <Typography>{route.summary}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}
        </Box>
    );
};

export default MapDirectionsDetails;
