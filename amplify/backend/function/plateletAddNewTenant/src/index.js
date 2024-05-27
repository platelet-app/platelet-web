/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	AUTH_PLATELET61A0AC07_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const aws = require("aws-sdk");
const uuid = require("uuid");
const { sendTenantWelcomeEmail } = require("/opt/sendWelcomeEmail");

const {
    createUser,
    updateUser,
    createTenant,
    deleteTenant,
    deleteUser,
} = require("/opt/graphql/mutations");
const { getTenant, getUser } = require("/opt/graphql/queries");

const { request, errorCheck } = require("/opt/appSyncRequest");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

function generateReferenceIdentifier(tenantName) {
    if (!tenantName) {
        throw new Error(`tenantName is required`);
    }
    // strip all non-alphanumeric characters
    tenantName = tenantName.replace(/[^a-zA-Z0-9]/g, "");
    if (tenantName.length < 4) {
        throw new Error(
            `tenantName must be at least 4 characters without whitespace`
        );
    }
    return tenantName.substring(0, 4);
    //let attempt = 0;
    //const listTenantsResult = await request(
    //    {
    //        query: listTenants,
    //    },
    //    GRAPHQL_ENDPOINT
    //);
    //const tenantReferenceIdentifiers =
    //    listTenantsResult.data.listTenants.items.map(
    //        (tenant) => tenant.referenceIdentifier
    //    );
    //console.log("Tenant reference identifiers:", tenantReferenceIdentifiers);
    //// get first 4 characters of tenant name
    //let first4Characters = tenantName.substring(0, 4);
    //while (
    //    attempt < tenantName.length - 3 &&
    //    tenantReferenceIdentifiers
    //        .map((n) => n.toLowerCase())
    //        .includes(first4Characters.toLowerCase())
    //) {
    //    // replace the last character of the first 4 characters with the next letter in the tenant name
    //    first4Characters =
    //        first4Characters.substring(0, 3) +
    //        String.fromCharCode(tenantName.charCodeAt(3) + attempt);
    //    attempt++;
    //}
    //if (
    //    tenantReferenceIdentifiers
    //        .map((n) => n.toLowerCase())
    //        .includes(first4Characters.toLowerCase())
    //) {
    //    // generate 4 random letters
    //    first4Characters = first4Characters + uuid.v4().substring(0, 4);
    //}
    //if (
    //    tenantReferenceIdentifiers
    //        .map((n) => n.toLowerCase())
    //        .includes(first4Characters.toLowerCase())
    //) {
    //    throw new Error(`Could not generate a unique reference identifier`);
    //}
}

async function addTenant(tenant) {
    const referenceIdentifier = generateReferenceIdentifier(tenant.name);
    const createdTenantResult = await request(
        {
            query: createTenant,
            variables: { input: { ...tenant, referenceIdentifier } },
        },
        GRAPHQL_ENDPOINT
    );
    const createdTenant = await createdTenantResult.json();
    errorCheck(createdTenant);
    return createdTenant.data.createTenant;
}

async function addUserToCognito(user) {
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const cognitoClient = new CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
    });

    const generatedPassword = Math.random().toString(36).substr(2, 8);

    const cognitoResp = await cognitoClient
        .adminCreateUser({
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            UserAttributes: [
                {
                    Name: "email",
                    Value: user.emailAddress,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            TemporaryPassword: generatedPassword,
            UserPoolId: userPoolId,
            Username: user.username,
            MessageAction: "SUPPRESS",
        })
        .promise();

    console.log("Cognito response:", cognitoResp.User.Attributes);

    if (!cognitoResp.User) {
        throw new Error(
            `Failure to create new user with email ${user.emailAddress}`
        );
    }
    const subFind = cognitoResp.User.Attributes.find(
        (attr) => attr.Name === "sub"
    );
    if (!subFind) {
        throw new Error(`missing sub attribute for newly created user`);
    }
    const cognitoId = subFind.Value;
    if (!cognitoId) {
        throw new Error(`missing cognitoId attribute for newly created user`);
    }

    return {
        password: generatedPassword,
        sub: subFind.Value,
        username: user.username,
    };
}

async function setUserRoles(username) {
    console.log("Amending roles for:", username);
    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const cognitoClient = new CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
    });
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
    for (const role of ["USER", "ADMIN", "COORDINATOR"]) {
        await cognitoClient
            .adminAddUserToGroup({
                GroupName: role,
                UserPoolId: userPoolId,
                Username: username,
            })
            .promise();
    }
}

async function createNewAdminUser(newUser) {
    const tenantId = uuid.v4();

    let { name, displayName, emailAddress, username } = newUser;
    const createUserInput = {
        tenantId: tenantId,
        disabled: 0,
        isPrimaryAdmin: 1,
        cognitoId: uuid.v4(),
        username,
        name,
        displayName,
        roles: ["USER", "ADMIN", "COORDINATOR"],
        contact: { emailAddress },
    };

    const createdUserResponse = await request(
        {
            query: createUser,
            variables: { input: createUserInput },
        },
        GRAPHQL_ENDPOINT
    );
    const result = await createdUserResponse.json();
    errorCheck(result);
    return result.data.createUser;
}

async function updateUserTenantAndCognito(user, tenantId, cognitoId) {
    if (!user || !user._version || !user.id || !tenantId || !cognitoId) {
        throw new Error(`user, _version, tenantId, and cognitoId are required`);
    }
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const cognitoClient = new CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
    });

    await cognitoClient
        .adminUpdateUserAttributes({
            UserAttributes: [
                {
                    Name: "email",
                    Value: user.contact ? user.contact.emailAddress : null,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            UserPoolId: userPoolId,
            Username: user.username,
        })
        .promise();

    const updateUserInput = {
        id: user.id,
        tenantId: tenantId,
        cognitoId: cognitoId,
        _version: user._version,
    };

    const userResult = await request(
        {
            query: updateUser,
            variables: { input: updateUserInput },
        },
        GRAPHQL_ENDPOINT
    );
    const result = await userResult.json();
    errorCheck(result);
    return result.data.updateUser;
}

const cleanUp = async (user, tenant, cognitoUser) => {
    console.log("Cleaning up user and tenant");
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
    if (cognitoUser) {
        console.log("Deleting cognito user:", cognitoUser.username);
        const CognitoIdentityServiceProvider =
            aws.CognitoIdentityServiceProvider;
        const cognitoClient = new CognitoIdentityServiceProvider({
            apiVersion: "2016-04-19",
        });
        await cognitoClient
            .adminDeleteUser({
                UserPoolId: userPoolId,
                Username: user.username,
            })
            .promise();
    }
    if (user) {
        console.log("Deleting user:", user.id);
        const existingUser = await request(
            {
                query: getUser,
                variables: { id: user.id },
            },

            GRAPHQL_ENDPOINT
        );
        const result = await existingUser.json();
        if (result?.data?.getUser) {
            const { id, _version } = result.data.getUser;
            console.log("User id:", id, "version:", _version);
            await request(
                {
                    query: deleteUser,
                    variables: {
                        input: {
                            id,
                            _version,
                        },
                    },
                },
                GRAPHQL_ENDPOINT
            );
        } else {
            console.warn("User to clean up was not found");
        }
    }
    if (tenant) {
        console.log("Deleting tenant:", tenant.id);
        const existingTenant = await request(
            {
                query: getTenant,
                variables: { id: tenant.id },
            },

            GRAPHQL_ENDPOINT
        );
        const result = await existingTenant.json();
        if (result?.data?.getTenant) {
            const { id, _version } = result.data.getTenant;
            console.log("Tenant id:", id, "version:", _version);
            await request(
                {
                    query: deleteTenant,
                    variables: {
                        input: {
                            id,
                            _version,
                        },
                    },
                },
                GRAPHQL_ENDPOINT
            );
        } else {
            console.warn("Tenant to clean up was not found");
        }
    }
};

exports.handler = async (event) => {
    console.log("Arguments:", event.arguments);
    console.log(
        process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT,
        process.env.API_PLATELET_GRAPHQLAPIIDOUTPUT,
        process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
        process.env.ENV,
        process.env.REGION
    );
    const user = {
        name: event.arguments.name,
        displayName: event.arguments.name,
        emailAddress: event.arguments.emailAddress,
        roles: ["USER", "ADMIN", "COORDINATOR"],
        username: uuid.v4(),
    };
    const tenant = {
        name: event.arguments.tenantName,
    };
    let newUser, newTenant, cognitoUser;
    try {
        newUser = await createNewAdminUser(user);
        newTenant = await addTenant({
            ...tenant,
            tenantAdminId: newUser.id,
        });
        cognitoUser = await addUserToCognito(user, newTenant.id);
        const admin = await updateUserTenantAndCognito(
            newUser,
            newTenant.id,
            cognitoUser.sub
        );
        await setUserRoles(user.username);
        console.log("Tenant result:", newTenant);
        console.log("User result:", newUser);
        await sendTenantWelcomeEmail(
            event.arguments.emailAddress,
            event.arguments.name,
            cognitoUser.password
        );
        console.log("Successfully sent welcome email");
        return { ...newTenant, admin };
    } catch (e) {
        console.error("Error:", e);
        await cleanUp(newUser, newTenant, cognitoUser);
        throw e;
    }
};
