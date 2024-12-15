import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { MenuMainContainer } from "./navigation/MenuMainContainer";
import "./index.css";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch } from "react-redux";
import "@aws-amplify/ui-react/styles.css";
import Moment from "react-moment";
import { Logger } from "aws-amplify";
import { SnackbarProvider } from "notistack";
import moment from "moment-timezone";
import "moment/locale/en-gb";
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from "@mui/material/styles";
import { DataStore } from "aws-amplify";
import * as models from "./models";
import useCurrentTheme from "./hooks/useCurrentTheme";
import Login from "./scenes/Login/Login";
import SnackNotificationBar from "./components/SnackNotificationBar";
import TenantListProvider from "./scenes/TenantPicker/TenantListProvider";
import { initialiseApp } from "./redux/initialise/initialiseActions";
import * as Sentry from "@sentry/react";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;

if (process.env.REACT_APP_DEMO_MODE === "false") {
    Sentry.init({
        dsn: "something",
    });
}

declare module "@mui/material/styles" {
    interface Palette {
        taskStatus: {
            NEW: React.CSSProperties["color"];
            ACTIVE: React.CSSProperties["color"];
            PICKED_UP: React.CSSProperties["color"];
            DROPPED_OFF: React.CSSProperties["color"];
            COMPLETED: React.CSSProperties["color"];
            CANCELLED: React.CSSProperties["color"];
            ABANDONED: React.CSSProperties["color"];
            REJECTED: React.CSSProperties["color"];
            PENDING: React.CSSProperties["color"];
        };
    }

    interface PaletteOptions {
        taskStatus: {
            NEW: React.CSSProperties["color"];
            ACTIVE: React.CSSProperties["color"];
            PICKED_UP: React.CSSProperties["color"];
            DROPPED_OFF: React.CSSProperties["color"];
            COMPLETED: React.CSSProperties["color"];
            CANCELLED: React.CSSProperties["color"];
            ABANDONED: React.CSSProperties["color"];
            REJECTED: React.CSSProperties["color"];
            PENDING: React.CSSProperties["color"];
        };
    }
}

Logger.LOG_LEVEL = "ERROR";

(window as any).amplifyLogger = Logger;
(window as any).DataStore = DataStore;
(window as any).models = models;

Moment.globalMoment = moment;
Moment.globalLocale = "en-GB";

const taskStatus = {
    NEW: "rgba(252, 231, 121, 1)",
    ACTIVE: "cornflowerblue",
    PICKED_UP: "orange",
    DROPPED_OFF: "darkgreen",
    COMPLETED: "lightgreen",
    CANCELLED: "blue",
    ABANDONED: "red",
    REJECTED: "grey",
    PENDING: "lightblue",
};

// left here for demo mode
const InitComponent = ({ children }: { children: React.ReactNode }) => {
    const didInit = React.useRef(false);
    const dispatch = useDispatch();
    React.useEffect(() => {
        if (!didInit.current) {
            dispatch(initialiseApp());
            didInit.current = true;
        }
    }, [dispatch]);
    return <>{children}</>;
};

const App = (props: any) => {
    let theme;
    const themePreference = useCurrentTheme();
    if (themePreference === "dark") {
        theme = createTheme({
            palette: {
                mode: "dark",
                background: {
                    paper: "rgb(40, 40, 40)",
                    default: "rgb(30, 30, 30)",
                },
                taskStatus,
            },
        });
    } else {
        theme = createTheme({
            palette: {
                mode: "light",
                background: {
                    default: "rgb(235, 235, 235)",
                },
                taskStatus,
            },
        });
    }

    if (process.env.REACT_APP_DEMO_MODE === "true") {
        return (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <SnackbarProvider maxSnack={1}>
                            <InitComponent>
                                <CssBaseline />
                                <MenuMainContainer />
                                <SnackNotificationBar {...props} />
                            </InitComponent>
                        </SnackbarProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </APIProvider>
        );
    } else {
        return (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <SnackbarProvider maxSnack={1}>
                            <TenantListProvider>
                                <Login>
                                    <CssBaseline />
                                    <MenuMainContainer />
                                    <SnackNotificationBar {...props} />
                                </Login>
                            </TenantListProvider>
                        </SnackbarProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </APIProvider>
        );
    }
};

export default App;
