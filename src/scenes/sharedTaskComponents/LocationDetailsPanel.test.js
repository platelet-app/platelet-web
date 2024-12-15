import React from "react";
import LocationDetailsPanel from "./LocationDetailsPanel";
import { DataStore, API, Geo } from "aws-amplify";
import { render } from "../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import * as amplify from "aws-amplify";
import userEvent from "@testing-library/user-event";
import * as models from "../../models";
import _ from "lodash";
import { protectedFields, userRoles } from "../../apiConsts";
import { v4 as uuidv4 } from "uuid";

const errorMessage = "Sorry, something went wrong";

const tenantId = uuidv4();

jest.mock("aws-amplify", () => {
    const Amplify = {
        ...jest.requireActual("aws-amplify"),
        Geo: {
            searchByText: () => Promise.resolve([]),
        },
    };
    return Amplify;
});

const preloadedState = {
    tenantId,
    roleView: "ALL",
    whoami: {
        user: new models.User({
            roles: [userRoles.coordinator],
            tenantId: "tenant-id",
            displayName: "test",
        }),
    },
};

const mockLocations = _.range(0, 10).map((i) => {
    return new models.Location({
        tenantId,
        name: uuidv4(),
        listed: 1,
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: uuidv4(),
            name: uuidv4(),
        },
        ward: uuidv4(),
        line1: uuidv4(),
        line2: uuidv4(),
        town: uuidv4(),
        county: uuidv4(),
        country: uuidv4(),
        postcode: uuidv4(),
        what3words: uuidv4(),
        disabled: 0,
    });
});

describe("LocationDetailsPanel", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        await DataStore.clear();
        for (const loc of mockLocations) {
            await DataStore.save(loc);
        }
    });

    it.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("renders the correct title", async ({ locationKey }) => {
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                locationKey={locationKey}
            />,
            {
                preloadedState,
            }
        );
        expect(
            screen.getByText(
                locationKey === "pickUpLocation" ? "Collect from" : "Deliver to"
            )
        ).toBeInTheDocument();
    });

    it("renders the correct location name", async () => {
        const mockTask = new models.Task({ pickUpLocation: mockLocations[1] });
        await DataStore.save(mockTask);
        const mockLocation = mockLocations[1];
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={mockTask.id}
                locationKey={"pickUpLocation"}
            />,
            { preloadedState }
        );
        expect(await screen.findByText(mockLocation.name)).toBeInTheDocument();
        expect(screen.getByText(RegExp(mockLocation.ward))).toBeInTheDocument();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("selecting a location from a preset", async ({ locationKey }) => {
        const mockLocation = mockLocations[6];
        const task = new models.Task({});
        await DataStore.save(task);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={task.id}
                locationKey={locationKey}
            />,
            {
                preloadedState,
            }
        );

        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        userEvent.click(screen.getByRole("button", { name: "Open" }));
        expect(screen.getByText(mockLocation.name)).toBeInTheDocument();
        userEvent.type(screen.getByRole("textbox"), mockLocation.name);
        userEvent.click(await screen.findByText(mockLocation.name));
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(3));
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        expect(saveSpy).toHaveBeenCalledWith({
            ...task,
            [locationKey]: mockLocation,
        });
        expect(screen.queryByRole("textbox")).toBeNull();
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        expect(
            screen.getByRole("button", { name: "Clear" })
        ).toBeInTheDocument();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("clear a listed location", async ({ locationKey }) => {
        const task = new models.Task({ [locationKey]: mockLocations[0] });
        await DataStore.save(task);
        const saveSpy = jest.spyOn(DataStore, "save");
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValueOnce({
            data: {
                getTask: { ...task, _version: 1 },
            },
        });

        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={task.id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await screen.findByText(RegExp(mockLocations[0].line1));
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByRole("button", { name: "Clear" }));
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(apiSpy).toHaveBeenCalledTimes(2));
        expect(saveSpy).toHaveBeenCalledWith({
            ...task,
            [locationKey]: null,
        });
        const variables1 = apiSpy.mock.calls[0][0].variables;
        const variables2 = apiSpy.mock.calls[1][0].variables;

        expect(variables1).toEqual({
            id: expect.any(String),
        });

        expect(variables2).toEqual({
            input: {
                _version: 1,
                id: expect.any(String),
                [`${locationKey}Id`]: null,
            },
        });
        expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("clear a custom location", async ({ locationKey }) => {
        const unlistedLocation = new models.Location({
            name: "Custom location",
            line1: "Custom line 1",
            line2: "Custom line 2",
            town: "Custom town",
            county: "Custom county",
            country: "Custom country",
            postcode: "Custom postcode",
            contact: {
                name: "Custom contact name",
                telephoneNumber: "Custom telephone number",
                emailAddress: "Custom email address",
            },
            listed: 0,
        });
        const unlisted = await DataStore.save(unlistedLocation);
        const task = new models.Task({ [locationKey]: unlisted });
        await DataStore.save(task);
        const apiSpy = jest
            .spyOn(API, "graphql")
            .mockResolvedValueOnce({
                data: {
                    getTask: { ...task, _version: 1 },
                },
            })
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({
                data: {
                    getLocation: { ...unlistedLocation, _version: 1 },
                },
            })
            .mockResolvedValueOnce({
                data: { updateLocation: { _version: 2 } },
            });

        let clearedLocation = {};
        for (const field of Object.keys(
            _.omit(unlistedLocation, ...protectedFields)
        )) {
            clearedLocation[field] = null;
        }
        clearedLocation = { ...unlistedLocation, ...clearedLocation };
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={task.id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await screen.findByText(RegExp(unlistedLocation.line1));
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByRole("button", { name: "Clear" }));
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(
            screen.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() => expect(apiSpy).toHaveBeenCalledTimes(5));
        const variables1 = apiSpy.mock.calls[0][0].variables;
        const variables2 = apiSpy.mock.calls[1][0].variables;
        const variables3 = apiSpy.mock.calls[2][0].variables;
        const variables4 = apiSpy.mock.calls[3][0].variables;
        const variables5 = apiSpy.mock.calls[4][0].variables;
        expect(variables1).toEqual({
            id: expect.any(String),
        });

        expect(variables2).toEqual({
            input: {
                _version: 1,
                id: expect.any(String),
                [`${locationKey}Id`]: null,
            },
        });

        expect(variables3).toEqual({
            id: expect.any(String),
        });

        expect(variables4).toEqual({
            input: {
                _version: 1,
                contact: null,
                country: null,
                county: null,
                id: expect.any(String),
                line1: null,
                line2: null,
                line3: null,
                postcode: null,
                state: null,
                town: null,
                ward: null,
                what3words: null,
            },
        });

        expect(variables5).toEqual({
            input: {
                _version: 2,
                id: expect.any(String),
            },
        });

        expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("copy a preset and enable editing", async ({ locationKey }) => {
        const mockListedLocation = mockLocations[0];
        const task = new models.Task({ [locationKey]: mockListedLocation });
        const fakeLocation = new models.Location({
            ...mockListedLocation,
            listed: 0,
            name: `${mockListedLocation.name} (edited)`,
        });
        await DataStore.save(task);
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={task.id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await screen.findByText(RegExp(mockListedLocation.line1));
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByText(mockListedLocation.line1));
        const textBox = screen.getByRole("textbox", { name: "Line one" });
        userEvent.type(textBox, "test");
        userEvent.type(textBox, "{enter}");
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(2));
        expect(saveSpy).toHaveBeenNthCalledWith(1, {
            ...fakeLocation,
            id: expect.any(String),
            line1: `${fakeLocation.line1}test`,
        });
        expect(saveSpy).toHaveBeenNthCalledWith(2, {
            ...task,
            id: expect.any(String),
            [locationKey]: {
                ...fakeLocation,
                id: expect.any(String),
                line1: `${fakeLocation.line1}test`,
            },
        });
        userEvent.click(screen.getByRole("button", { name: "Finish" }));
        expect(
            screen.getByText(`${mockListedLocation.name} (edited)`)
        ).toBeInTheDocument();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("edit the details of a location", async ({ locationKey }) => {
        const fakeInputData = "new data";
        const fakeModel = new models.Location({
            ...mockLocations[1],
            listed: 0,
        });
        const fake = await DataStore.save(fakeModel);
        const mockTask = new models.Task({
            [locationKey]: fake,
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={mockTask.id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByText(mockLocations[1].ward));
        const textBox = screen.getByRole("textbox", { name: "Ward" });
        expect(textBox).toBeInTheDocument();
        expect(textBox).toHaveValue(mockLocations[1].ward);
        userEvent.type(textBox, " new data");
        userEvent.type(textBox, "{enter}");
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(3));
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        expect(saveSpy).toHaveBeenCalledWith({
            ...fakeModel,
            ward: `${fakeModel.ward} ${fakeInputData}`,
        });
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `(
        "edit the location information when location is null",
        async ({ locationKey }) => {
            const fakeLocationModel = new models.Location({
                line1: "new data",
                listed: 0,
            });
            const fakeTaskModel = new models.Task({});
            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            await DataStore.save(fakeTaskModel);
            render(
                <LocationDetailsPanel
                    taskModel={models.Task}
                    taskId={fakeTaskModel.id}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
            screen.getByText("Line one").click();
            const textBox = screen.getByRole("textbox", { name: "Line one" });
            expect(textBox).toBeInTheDocument();
            expect(textBox).toHaveValue("");
            userEvent.type(textBox, "new data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(2));
            expect(saveSpy).toHaveBeenCalledWith({
                ...fakeLocationModel,
                tenantId,
                id: expect.any(String),
            });
            expect(saveSpy).toHaveBeenCalledWith({
                ...fakeTaskModel,
                id: expect.any(String),
                [locationKey]: {
                    ...fakeLocationModel,
                    tenantId,
                    id: expect.any(String),
                },
            });
        }
    );

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("edit the contact information of a location", async ({ locationKey }) => {
        const fakeInputData = "new data";
        const fakeModel = new models.Location({
            ...mockLocations[1],
            listed: 0,
        });
        const mockTask = new models.Task({
            [locationKey]: fakeModel,
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={mockTask.id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByText(fakeModel.contact.name));
        const textBox = screen.getByRole("textbox", { name: "Name" });
        expect(textBox).toBeInTheDocument();
        expect(textBox).toHaveValue(fakeModel.contact.name);
        userEvent.type(textBox, " new data");
        userEvent.type(textBox, "{enter}");
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        expect(saveSpy).toHaveBeenCalledWith({
            ...fakeModel,
            contact: {
                ...fakeModel.contact,
                name: `${fakeModel.contact.name} ${fakeInputData}`,
            },
        });
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `(
        "add contact information to an empty location",
        async ({ locationKey }) => {
            const fakeInputData = "new data";
            const fakeModel = new models.Location({
                listed: 0,
                tenantId,
            });
            const fakeTask = new models.Task({
                tenantId,
            });
            await DataStore.save(fakeTask);
            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            render(
                <LocationDetailsPanel
                    taskModel={models.Task}
                    taskId={fakeTask.id}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
            userEvent.click(screen.getByText("Name"));
            const textBox = screen.getAllByRole("textbox")[1];
            userEvent.type(textBox, "new data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(1, {
                    ...fakeModel,
                    contact: { name: fakeInputData },
                    id: expect.any(String),
                })
            );
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(2, {
                    ...fakeTask,
                    id: expect.any(String),
                    [locationKey]: {
                        ...fakeModel,
                        contact: { name: fakeInputData },
                        id: expect.any(String),
                    },
                })
            );
        }
    );

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `(
        "add address information then contact information to an empty location",
        async ({ locationKey }) => {
            const fakeInputData = "new data";
            const fakeTask = new models.Task({
                tenantId,
            });
            const fakeModel = new models.Location({
                listed: 0,
                tenantId,
            });
            await DataStore.save(fakeTask);
            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            render(
                <LocationDetailsPanel
                    taskModel={models.Task}
                    taskId={fakeTask.id}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
            userEvent.click(screen.getByText("Ward"));
            const textBox = screen.getAllByRole("textbox")[1];
            userEvent.type(textBox, "ward data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(1, {
                    ...fakeModel,
                    ward: "ward data",
                    id: expect.any(String),
                })
            );
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(2, {
                    ...fakeTask,
                    [locationKey]: {
                        ...fakeModel,
                        ward: "ward data",
                        id: expect.any(String),
                    },
                })
            );
            userEvent.click(screen.getByText("Name"));
            const textBox2 = screen.getByRole("textbox", { name: "Name" });
            userEvent.type(textBox2, fakeInputData);
            userEvent.type(textBox2, "{enter}");
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(3, {
                    ...fakeModel,
                    ward: "ward data",
                    contact: {
                        ...fakeModel.contact,
                        name: `${fakeInputData}`,
                    },
                    id: expect.any(String),
                })
            );
        }
    );

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("respond to a preset being set remotely", async ({ locationKey }) => {
        const mockLocation = new models.Location({
            name: "test location",
            line1: "test line 1",
            listed: 1,
        });
        const task = await DataStore.save(new models.Task({}));
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={task.id}
                locationKey={locationKey}
            />
        );

        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        await DataStore.save(
            models.Task.copyOf(task, (upd) => (upd[locationKey] = mockLocation))
        );
        await waitFor(() =>
            expect(screen.getByText(mockLocation.line1)).toBeInTheDocument()
        );
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("respond to a remote location edit", async ({ locationKey }) => {
        const mockLocation = new models.Location({
            name: "test location",
            listed: 0,
        });
        const task = await DataStore.save(
            new models.Task({
                [locationKey]: mockLocation,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={task.id}
                locationKey={locationKey}
            />
        );

        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        await DataStore.save(
            models.Location.copyOf(
                mockLocation,
                (upd) => (upd.line1 = "new data")
            )
        );
        await waitFor(() =>
            expect(screen.getByText("new data")).toBeInTheDocument()
        );
    });

    test.skip.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("respond to a remote clear", async ({ locationKey }) => {
        const mockLocation = new models.Location({
            name: "test location",
            listed: 1,
        });
        const task = await DataStore.save(
            new models.Task({
                [locationKey]: mockLocation,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={task.id}
                locationKey={locationKey}
            />
        );

        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        await DataStore.save(
            models.Task.copyOf(task, (upd) => (upd[locationKey] = null))
        );
        await waitFor(() =>
            expect(screen.queryByText(mockLocation.name)).toBeNull()
        );
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `(
        "add contact information then address information to an empty location",
        async ({ locationKey }) => {
            const fakeInputData = "new data";
            const fakeTask = new models.Task({
                tenantId,
            });
            const fakeModel = new models.Location({
                listed: 0,
                tenantId,
            });
            new models.Location({
                listed: 0,
                contact: { name: fakeInputData },
                tenantId,
            });
            await DataStore.save(fakeTask);
            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            render(
                <LocationDetailsPanel
                    taskModel={models.Task}
                    task={fakeTask}
                    taskId={fakeTask.id}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
            userEvent.click(screen.getByText("Name"));
            const textBox2 = screen.getAllByRole("textbox")[1];
            userEvent.type(textBox2, fakeInputData);
            userEvent.type(textBox2, "{enter}");
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(1, {
                    ...fakeModel,
                    contact: {
                        ...fakeModel.contact,
                        name: `${fakeInputData}`,
                    },
                    id: expect.any(String),
                })
            );
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(2, {
                    ...fakeTask,
                    id: expect.any(String),
                    [locationKey]: {
                        ...fakeModel,
                        contact: {
                            ...fakeModel.contact,
                            name: `${fakeInputData}`,
                        },
                        id: expect.any(String),
                    },
                })
            );
            userEvent.click(screen.getByText("Ward"));
            const textBox = screen.getByRole("textbox", { name: "Ward" });
            userEvent.type(textBox, "ward data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(3, {
                    ...fakeModel,
                    contact: { name: fakeInputData },
                    ward: "ward data",
                    id: expect.any(String),
                })
            );
        }
    );

    test("error on location get", async () => {
        const querySpy = jest
            .spyOn(DataStore, "query")
            .mockImplementation(() => {
                throw new Error("error");
            });
        const fakeTask = new models.Task({
            tenantId,
            pickUpLocation: { id: "test" },
        });
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={"fakeId"}
                locationKey={"pickUpLocation"}
            />,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("unsubscribes observers on unmount", async () => {
        const unsubscribe = jest.fn();
        const observeSpy = jest
            .spyOn(amplify.DataStore, "observe")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });
        const querySpy = jest.spyOn(DataStore, "query");
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        const mockLocation = new models.Location({
            name: "test location",
            listed: 0,
        });
        const task = await DataStore.save(
            new models.Task({
                pickUpLocation: mockLocation,
            })
        );
        const { component } = render(
            <LocationDetailsPanel
                taskModel={models.Task}
                locationKey={"pickUpLocation"}
                taskId={task.id}
            />
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(observeSpy).toHaveBeenCalledTimes(2);
        });
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        component.unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(2);
    });

    test("don't allow riders to edit", async () => {
        const mockLocation = new models.Location({
            name: "test location",
            listed: 0,
        });
        const task = await DataStore.save(
            new models.Task({
                pickUpLocation: mockLocation,
            })
        );
        const mockAssignee = new models.User({
            displayName: "test user",
            roles: [userRoles.rider],
        });
        const mockAssignment = new models.TaskAssignee({
            task,
            assignee: mockAssignee,
            role: userRoles.rider,
        });

        const preloadedState = {
            whoami: { user: mockAssignee },
            roleView: userRoles.rider,
            taskAssigneesReducer: {
                ready: true,
                isSynced: true,
                items: [mockAssignment],
            },
        };

        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                locationKey={"pickUpLocation"}
                taskId={task.id}
            />,
            { preloadedState }
        );
        await waitFor(() => {
            expect(screen.queryByText("Edit")).toBeNull();
        });
    });

    test("don't allow riders to set the location", async () => {
        const task = await DataStore.save(new models.Task({}));
        const mockAssignee = new models.User({
            displayName: "test user",
            roles: [userRoles.rider],
        });
        const mockAssignment = new models.TaskAssignee({
            task,
            assignee: mockAssignee,
            role: userRoles.rider,
        });

        const preloadedState = {
            whoami: { user: mockAssignee },
            roleView: userRoles.rider,
            taskAssigneesReducer: {
                ready: true,
                isSynced: true,
                items: [mockAssignment],
            },
        };

        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                locationKey={"pickUpLocation"}
                taskId={task.id}
            />,
            { preloadedState }
        );
        await waitFor(() => {
            expect(screen.queryByText("Edit")).toBeNull();
        });
        expect(screen.queryByRole("textbox")).toBeNull();
        expect(screen.getByText("No location set.")).toBeInTheDocument();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `(
        "confirm when replacing a location with a preset",
        async ({ locationKey }) => {
            const mockLocation = new models.Location({
                name: "test location",
                listed: 0,
            });
            const task = await DataStore.save(
                new models.Task({
                    [locationKey]: mockLocation,
                })
            );
            await DataStore.save(
                new models.Location({
                    name: "test preset",
                    listed: 1,
                })
            );
            const mockPreset2 = await DataStore.save(
                new models.Location({
                    name: "new preset",
                    listed: 1,
                })
            );

            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");

            render(
                <LocationDetailsPanel
                    taskModel={models.Task}
                    locationKey={locationKey}
                    taskId={task.id}
                />,
                { preloadedState: preloadedState }
            );
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            userEvent.click(screen.getByRole("button", { name: "Edit" }));
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(2);
            });
            userEvent.type(screen.getByRole("combobox"), "new preset");
            userEvent.click(await screen.findByText("preset"));
            const label =
                locationKey === "pickUpLocation" ? "pick-up" : "delivery";
            expect(
                await screen.findByText(
                    `This will replace the ${label} location with the selected preset. Are you sure you want to continue?`
                )
            ).toBeInTheDocument();
            userEvent.click(screen.getByRole("button", { name: "OK" }));
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...task,
                    [locationKey]: mockPreset2,
                });
            });
        }
    );
    test("online search when selecting a location", async () => {
        const fakeOnlineLocation = {
            label: "testLabel",
            addressNumber: "123",
            street: "testStreet",
            neighborhood: "testNeighborhood",
            municipality: "testMunicipality",
            subRegion: "testSubRegion",
            country: "testCountry",
            postalCode: "testPostalCode",
        };

        const task = new models.Task({});
        await DataStore.save(task);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        jest.spyOn(Geo, "searchByText").mockResolvedValue([fakeOnlineLocation]);
        render(
            <LocationDetailsPanel
                taskModel={models.Task}
                taskId={task.id}
                locationKey={"pickUpLocation"}
            />,
            {
                preloadedState,
            }
        );
        const mockLocation = new models.Location({
            country: "testCountry",
            county: "testSubRegion",
            line1: "123 testStreet",
            line2: "testNeighborhood",
            listed: 0,
            postcode: "testPostalCode",
            tenantId,
            town: "testMunicipality",
        });

        render(<LocationDetailsPanel />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(2));
        const textBox = screen.getByRole("combobox", {
            name: "Search locations...",
        });
        userEvent.type(textBox, "testLabel");
        const option = await screen.findByText(
            "testLabel",
            {},
            { timeout: 1000 }
        );
        userEvent.click(option);
        await waitFor(() => {
            expect(screen.queryByText("testLabel")).toBeNull();
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(2);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockLocation,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...task,
            pickUpLocation: { ...mockLocation, id: expect.any(String) },
            id: expect.any(String),
        });
        const { label, addressNumber, street, ...rest } = fakeOnlineLocation;
        expect(
            screen.getByText(RegExp(`${addressNumber} ${street}`))
        ).toBeInTheDocument();
        for (const value of Object.values(rest)) {
            expect(screen.getByText(RegExp(value))).toBeInTheDocument();
        }
    });
});
