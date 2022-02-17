/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	AUTH_PLATELET61A0AC07_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

require("isomorphic-fetch");
const aws = require("aws-sdk");
const AWS = require("aws-sdk/global");
const AUTH_TYPE = require("aws-appsync").AUTH_TYPE;
const AWSAppSyncClient = require("aws-appsync").default;
const uuid = require("uuid");
const createUser = require("./createUser").createUser;
const listUsers = require("./listUsers").listUsers;

async function sendWelcomeEmail(emailAddress, recipientName, password) {
    const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: process.env.REGION,
    });
    const params = {
        Destination: {
            ToAddresses: [emailAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <p>
                        Welcome to ${process.env.PLATELET_DOMAIN_NAME}, ${recipientName}!
                    </p>
                    <p>
                        An admin has created your account for you with a temporary password.
                    </p>
                    <p>
                        <b>Username:</b> ${emailAddress}
                    </p>
                    <p>
                        <b>Password:</b> ${password}
                    </p>
                    <p>
                        Thank you.
                    </p>
                    `,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `Welcome to ${process.env.PLATELET_DOMAIN_NAME}, ${recipientName}!
                    An admin has created your account for you. A temporary password has been generated for you.
                    Username: ${emailAddress}
                    Password: ${password}
                    Thank you.`,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Welcome to Platelet!",
            },
        },
        Source: process.env.PLATELET_WELCOME_EMAIL,
        ReplyToAddresses: [process.env.PLATELET_WELCOME_EMAIL],
        ReturnPath: process.env.PLATELET_WELCOME_EMAIL,
    };

    return await ses.sendEmail(params).promise();
}

async function inviteNewUserToTeam(newUser, tenantId) {
    const config = {
        url: process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT,
        region: process.env.REGION,
        auth: {
            type: AUTH_TYPE.AWS_IAM,
            credentials: AWS.config.credentials,
        },
        disableOffline: true,
    };
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;

    const appSyncClient = new AWSAppSyncClient(config);
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
                    Value: newUser.email,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
                {
                    Name: "custom:tenantId",
                    Value: tenantId,
                },
            ],
            TemporaryPassword: generatedPassword,
            UserPoolId: userPoolId,
            Username: uuid.v4(),
            MessageAction: "SUPPRESS",
        })
        .promise();

    if (!cognitoResp.User) {
        throw new Error(
            `Failure to create new user with email ${newUser.email}`
        );
    }
    let displayName = newUser.name;
    const listUsersResp = await appSyncClient.query({
        query: listUsers,
        variables: { tenantId },
    });
    const userCheck = listUsersResp.data.listUsers.items;
    let counter = 0;
    while (true) {
        const current =
            counter === 0 ? newUser.name : `${newUser.name}-${counter}`;
        if (userCheck.map((u) => u.displayName).includes(current)) {
            counter++;
        } else {
            displayName = current;
            break;
        }
    }
    console.log(`Final display name: ${displayName}`);
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
    const createUserInput = {
        tenantId: tenantId,
        active: 1,
        cognitoId,
        name: newUser.name,
        displayName,
        roles:
            newUser.roles && newUser.roles.includes("USER")
                ? newUser.roles
                : ["USER"],
        contact: { emailAddress: newUser.email },
    };

    const createdUser = await appSyncClient.mutate({
        mutation: createUser,
        variables: { input: createUserInput },
    });

    return {
        newUser: createdUser.data.createUser,
        password: generatedPassword,
    };
}

exports.handler = async (event) => {
    console.log("Arguments:", event.arguments);
    const tenantId = event.arguments.tenantId;
    const user = {
        name: event.arguments.name,
        email: event.arguments.email,
        roles: event.arguments.roles || ["USER"],
    };
    const { newUser, password } = await inviteNewUserToTeam(user, tenantId);
    console.log("User result:", newUser);
    await sendWelcomeEmail(
        event.arguments.email,
        event.arguments.name,
        password
    );
    console.log("Successfully sent welcome email");
    const response = {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
        //  },
        message: "user created",
        user: newUser,
    };
    return response;
};