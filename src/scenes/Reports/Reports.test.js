import { DataStore } from "aws-amplify";
import _ from "lodash";
import * as models from "../../models";
import Reports from "./Reports";
import { render } from "../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as gr from "./utilities/generateReportBasic";
import { userRoles } from "../../apiConsts";
import { setReadyStatus } from "../../redux/awsHubListener/awsHubListenerActions";
import { Days, dayOptions } from "../../components/DaysSelection";

const tenantId = "testTenantId";

const preloadedHub = {
    tenantId,
    awsHubDataStoreEventsReducer: {
        dataStoreReadyStatus: true,
        networkStatus: true,
    },
};

describe("Reports", () => {
    const isoDate = "2021-11-29T23:00:00.000Z";

    const RealDate = Date;

    function mockDate() {
        global.Date = class extends RealDate {
            constructor() {
                super();
                return new RealDate(isoDate);
            }
        };
    }

    beforeAll(() => {
        // add window.matchMedia
        // this is necessary for the date picker to be rendered in desktop mode.
        // if this is not provided, the mobile mode is rendered, which might lead to unexpected behavior
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: (query) => ({
                media: query,
                // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
                matches: query === "(pointer: fine)",
                onchange: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                addListener: () => {},
                removeListener: () => {},
                dispatchEvent: () => false,
            }),
        });
    });

    afterAll(() => {
        delete window.matchMedia;
    });

    beforeEach(async () => {
        mockDate();
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        global.Date = RealDate;
    });

    beforeAll(async () => {
        await Promise.all(
            _.range(0, 10).map((i) => DataStore.save(new models.Task({})))
        );
        global.URL.createObjectURL = jest.fn();
    });

    test("generate and download a CSV report", async () => {
        const generateReportSpy = jest.spyOn(gr, "default").mockResolvedValue();
        const whoami = new models.User({
            displayName: "Test User",
            name: "testuser",
            roles: [userRoles.coordinator],
        });
        const startDate = new Date(isoDate);
        startDate.setDate(startDate.getDate() - 3);

        const preloadedState = { ...preloadedHub, whoami: { user: whoami } };
        await DataStore.save(
            new models.TaskAssignee({
                assignee: whoami,
                task: new models.Task({ status: "NEW" }),
            })
        );
        render(<Reports />, { preloadedState });
        const button = screen.getByRole("button", { name: "Export" });
        userEvent.click(button);
        expect(button).toBeDisabled();
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalledWith(
                whoami.id,
                userRoles.coordinator,
                tenantId,
                startDate,
                new Date(isoDate)
            );
        });
    });

    test("no other user select if not an admin", async () => {
        const whoami = new models.User({
            displayName: "Test User",
            name: "testuser",
            roles: [userRoles.coordinator],
        });

        const preloadedState = { ...preloadedHub, whoami: { user: whoami } };
        render(<Reports />, { preloadedState });
        expect(screen.queryByRole("combobox")).toBeNull();
    });

    test("export data for another coordinator if an admin", async () => {
        const generateReportSpy = jest.spyOn(gr, "default").mockResolvedValue();
        const querySpy = jest.spyOn(DataStore, "query");
        const whoami = await DataStore.save(
            new models.User({
                displayName: "Test User",
                roles: [userRoles.admin, userRoles.coordinator],
            })
        );
        const anotherCoord = await DataStore.save(
            new models.User({
                displayName: "Some Coordinator",
                roles: [userRoles.coordinator],
            })
        );
        const preloadedStateWhoami = {
            ...preloadedHub,
            whoami: {
                user: whoami,
            },
        };
        const startDate = new Date(isoDate);
        startDate.setDate(startDate.getDate() - 3);
        render(<Reports />, {
            preloadedState: preloadedStateWhoami,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "COORDINATOR" }));
        const searchCoords = screen.getByRole("combobox");
        userEvent.type(searchCoords, "Some Coordinator");
        userEvent.click(await screen.findByText(anotherCoord.displayName));
        expect(screen.queryByRole("combobox")).toBeNull();
        expect(
            await screen.findByText(anotherCoord.displayName)
        ).toBeInTheDocument();
        const button = screen.getByRole("button", { name: "Export" });
        userEvent.click(button);
        expect(button).toBeDisabled();
        expect(generateReportSpy).toHaveBeenCalledWith(
            anotherCoord.id,
            userRoles.coordinator,
            tenantId,
            startDate,
            new Date(isoDate)
        );
    });

    test.each`
        days
        ${Days.ONE_DAY} | ${Days.THREE_DAYS} | ${Days.FIVE_DAYS} | ${Days.ONE_WEEK}
    `("test selecting different amount of days", async ({ days }) => {
        const generateReportSpy = jest.spyOn(gr, "default").mockResolvedValue();
        const whoami = new models.User({
            displayName: "Test User",
            name: "testuser",
            roles: [userRoles.coordinator],
        });

        const preloadedState = { ...preloadedHub, whoami: { user: whoami } };

        const startDate = new Date(isoDate);
        startDate.setDate(startDate.getDate() - days);

        render(<Reports />, { preloadedState });
        const button = screen.getByRole("button", { name: "Export" });
        const label = Object.keys(dayOptions).find(
            (key) => dayOptions[key] === days
        );
        userEvent.click(screen.getByRole("button", { name: label }));
        userEvent.click(button);
        expect(button).toBeDisabled();
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalledWith(
                whoami.id,
                userRoles.coordinator,
                tenantId,
                startDate,
                new Date(isoDate)
            );
        });
    });

    test.each`
        role
        ${userRoles.admin} | ${userRoles.rider} | ${userRoles.coordinator}
    `("show the correct roles available to the user", async ({ role }) => {
        const whoami = await DataStore.save(
            new models.User({
                displayName: "Test User",
                roles: [role],
            })
        );
        const preloadedState = {
            whoami: {
                user: whoami,
            },
        };
        render(<Reports />, { preloadedState });
        if (role === userRoles.admin) {
            expect(screen.getByText("ALL")).toBeInTheDocument();
            expect(screen.getByText("COORDINATOR")).toBeInTheDocument();
            expect(screen.getByText("RIDER")).toBeInTheDocument();
        } else if (role === userRoles.rider) {
            expect(screen.getByText("RIDER")).toBeInTheDocument();
            expect(screen.queryByText("ALL")).toBeNull();
            expect(screen.queryByText("COORDINATOR")).toBeNull();
        } else if (role === userRoles.coordinator) {
            expect(screen.getByText("COORDINATOR")).toBeInTheDocument();
            expect(screen.queryByText("ALL")).toBeNull();
            expect(screen.queryByText("RIDER")).toBeNull();
        }
    });
    test("export with a custom date range", async () => {
        const whoami = await DataStore.save(
            new models.User({
                displayName: "Test User",
                roles: [userRoles.admin],
            })
        );
        const preloadedState = {
            tenantId,
            whoami: {
                user: whoami,
            },
        };
        const startDate = new Date(isoDate);
        startDate.setDate(startDate.getDate() - 3);
        const generateReportSpy = jest.spyOn(gr, "default").mockResolvedValue();
        render(<Reports />, { preloadedState });
        userEvent.click(screen.getByRole("button", { name: "Custom" }));
        const startDateBox = screen.getByRole("textbox", {
            name: "Start date",
        });
        const endDateBox = screen.getByRole("textbox", { name: "End date" });
        userEvent.clear(startDateBox);
        userEvent.type(startDateBox, "2021-01-01");
        userEvent.clear(endDateBox);
        userEvent.type(endDateBox, "2021-01-31");
        const button = screen.getByRole("button", { name: "Export" });
        userEvent.click(button);
        expect(button).toBeDisabled();
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalledWith(
                null,
                "ALL",
                tenantId,
                new Date("2021-01-01"),
                new Date("2021-01-31")
            );
        });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
        userEvent.click(
            screen.getByRole("button", { name: "back to days selection" })
        );
        expect(screen.getByRole("button", { name: "3 days" })).toHaveClass(
            "MuiChip-filled"
        );
        userEvent.click(button);
        await waitFor(() => {
            expect(generateReportSpy).toHaveBeenCalledWith(
                null,
                "ALL",
                tenantId,
                startDate,
                new Date(isoDate)
            );
        });
    });
    test("don't show custom if a role is picked", async () => {
        const whoami = await DataStore.save(
            new models.User({
                displayName: "Test User",
                roles: [userRoles.admin],
            })
        );
        const preloadedState = {
            tenantId,
            whoami: {
                user: whoami,
            },
        };
        render(<Reports />, { preloadedState });
        expect(
            screen.getByRole("button", { name: "Custom" })
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "RIDER" }));
        expect(screen.queryByRole("button", { name: "Custom" })).toBeNull();
    });
});
