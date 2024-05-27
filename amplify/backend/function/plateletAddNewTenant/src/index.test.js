const handler = require("./index").handler;
const awssdk = require("aws-sdk");
const uuid = require("uuid");

jest.mock(
    "/opt/appSyncRequest",
    () => {
        return {
            request: jest.fn(),
            errorCheck: jest.fn(),
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/mutations",
    () => {
        return {
            createUser: "createUserMutation",
            createTenant: "createTenantMutation",
            updateUser: "updateUserMutation",
            deleteUser: "deleteUserMutation",
            deleteTenant: "deleteTenantMutation",
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/queries",
    () => {
        return {
            listUsers: "listUsersQuery",
            listTenants: "listTenantsQuery",
            getUser: "getUserQuery",
            getTenant: "getTenantQuery",
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/sendWelcomeEmail",
    () => {
        return {
            sendTenantWelcomeEmail: jest.fn(),
        };
    },
    { virtual: true }
);

const appsyncModule = require("/opt/appSyncRequest");
const sendEmailModule = require("/opt/sendWelcomeEmail");

const mockCognitoResponse = {
    User: {
        Attributes: [
            {
                Name: "sub",
                Value: "testSubId",
            },
        ],
    },
};

const mockUpdateUserResult = {
    data: {
        updateUser: {
            id: "testUserId",
            displayName: "New User",
            name: "New User",
            tenantId: "testTenantId",
            cognitoId: "testSubId",
            username: "testUsername",
            contact: {
                emailAddress: "test@test.com",
            },
            _version: 1,
        },
    },
};
const mockNewUserResult = {
    data: {
        createUser: {
            id: "testUserId",
            displayName: "New User",
            name: "New User",
            tenantId: "testTenantId",
            cognitoId: "someCognitoId",
            username: "testUsername",
            contact: {
                emailAddress: "test@test.com",
            },
            _version: 1,
        },
    },
};

const mockTenantResult = {
    data: {
        createTenant: {
            id: "testTenantId",
            name: "test tenant",
        },
    },
};

jest.mock("aws-sdk", () => {
    return {
        CognitoIdentityServiceProvider: class {
            adminCreateUser() {
                return this;
            }
            adminDeleteUser() {
                return this;
            }
            adminAddUserToGroup() {
                return this;
            }
            adminUpdateUserAttributes() {
                return this;
            }
            promise() {
                return Promise.resolve(mockCognitoResponse);
            }
        },
    };
});

describe("plateletAddNewTenant", () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV }; // Make a copy
    });

    afterEach(() => jest.clearAllMocks());

    it("should return a function", () => {
        expect(typeof handler).toBe("function");
    });

    test("add a new tenant", async () => {
        jest.spyOn(appsyncModule, "request")
            .mockResolvedValueOnce({ json: () => mockNewUserResult })
            .mockResolvedValueOnce({ json: () => mockTenantResult })
            .mockResolvedValueOnce({ json: () => mockUpdateUserResult });
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const cognitoAdminUpdateUserAttributesSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminUpdateUserAttributes"
        );
        const cognitoGroupsSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminAddUserToGroup"
        );
        const requestSpy = jest.spyOn(appsyncModule, "request");
        const sendEmailSpy = jest.spyOn(
            sendEmailModule,
            "sendTenantWelcomeEmail"
        );
        const mockEvent = {
            arguments: {
                name: "New User",
                emailAddress: "test@test.com",
                tenantName: "test tenant",
            },
        };
        const result = await handler(mockEvent);
        expect(cognitoSpy).toHaveBeenCalledWith({
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            UserAttributes: [
                {
                    Name: "email",
                    Value: mockEvent.arguments.emailAddress,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            UserPoolId: "testPoolId",
            TemporaryPassword: expect.stringMatching(/^[\w+]{8}$/),
            MessageAction: "SUPPRESS",
            Username: expect.any(String),
        });
        const createUserInput = {
            cognitoId: expect.any(String),
            name: mockEvent.arguments.name,
            displayName: mockEvent.arguments.name,
            roles: ["USER", "ADMIN", "COORDINATOR"],
            isPrimaryAdmin: 1,
            disabled: 0,
            contact: { emailAddress: mockEvent.arguments.emailAddress },
            username: expect.any(String),
            tenantId: expect.any(String),
        };
        const createTenantInput = {
            name: mockEvent.arguments.tenantName,
            referenceIdentifier: "test",
            tenantAdminId: "testUserId",
        };
        const updateUserInput = {
            id: "testUserId",
            cognitoId: "testSubId",
            _version: 1,
            tenantId: "testTenantId",
        };

        expect(requestSpy).toHaveBeenCalledWith(
            {
                query: "createUserMutation",
                variables: { input: createUserInput },
            },
            "testEndpoint"
        );
        expect(requestSpy).toHaveBeenCalledWith(
            {
                query: "createTenantMutation",
                variables: { input: createTenantInput },
            },
            "testEndpoint"
        );
        expect(requestSpy).toHaveBeenNthCalledWith(
            3,
            {
                query: "updateUserMutation",
                variables: { input: updateUserInput },
            },
            "testEndpoint"
        );
        for (const group of ["USER", "ADMIN", "COORDINATOR"]) {
            expect(cognitoGroupsSpy).toHaveBeenCalledWith({
                GroupName: group,
                UserPoolId: "testPoolId",
                Username: expect.any(String),
            });
        }
        expect(cognitoAdminUpdateUserAttributesSpy).toHaveBeenCalledWith({
            UserAttributes: [
                {
                    Name: "email",
                    Value: mockEvent.arguments.emailAddress,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            UserPoolId: "testPoolId",
            Username: "testUsername",
        });
        expect(sendEmailSpy).toHaveBeenCalledWith(
            mockEvent.arguments.emailAddress,
            mockEvent.arguments.name,
            expect.any(String)
        );
        expect(result).toEqual({
            id: "testTenantId",
            name: mockEvent.arguments.tenantName,
            admin: {
                id: "testUserId",
                name: mockEvent.arguments.name,
                displayName: mockEvent.arguments.name,
                tenantId: "testTenantId",
                cognitoId: "testSubId",
                username: expect.any(String),
                contact: {
                    emailAddress: mockEvent.arguments.emailAddress,
                },
                _version: 1,
            },
        });
    });
    test("clean up on failure", async () => {
        jest.spyOn(appsyncModule, "request")
            .mockResolvedValueOnce({ json: () => mockNewUserResult })
            .mockResolvedValueOnce({ json: () => mockTenantResult })
            .mockRejectedValueOnce(new Error("test error"))
            .mockResolvedValueOnce({
                json: () => ({
                    data: { getUser: { id: "deleteUserId", _version: 5 } },
                }),
            })
            .mockResolvedValueOnce({ json: () => {} })
            .mockResolvedValueOnce({
                json: () => ({
                    data: { getTenant: { id: "deleteTenantId", _version: 6 } },
                }),
            })
            .mockResolvedValue({ json: () => {} });
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const cognitoDeleteSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminDeleteUser"
        );
        const requestSpy = jest.spyOn(appsyncModule, "request");
        const mockEvent = {
            arguments: {
                name: "New User",
                emailAddress: "test@test.com",
                tenantName: "test tenant",
            },
        };
        await expect(handler(mockEvent)).rejects.toThrow("test error");
        expect(cognitoSpy).toHaveBeenCalledWith({
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            UserAttributes: [
                {
                    Name: "email",
                    Value: mockEvent.arguments.emailAddress,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            UserPoolId: "testPoolId",
            TemporaryPassword: expect.stringMatching(/^[\w+]{8}$/),
            MessageAction: "SUPPRESS",
            Username: expect.any(String),
        });

        expect(requestSpy).toHaveBeenCalledWith(
            {
                query: "deleteUserMutation",
                variables: { input: { id: "deleteUserId", _version: 5 } },
            },
            "testEndpoint"
        );
        expect(requestSpy).toHaveBeenCalledWith(
            {
                query: "deleteTenantMutation",
                variables: { input: { id: "deleteTenantId", _version: 6 } },
            },
            "testEndpoint"
        );
        expect(cognitoDeleteSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: "testUsername",
        });
    });
});
