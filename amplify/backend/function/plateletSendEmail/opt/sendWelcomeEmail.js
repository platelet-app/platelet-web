const aws = require("aws-sdk");

const PLATELET_DOMAIN_NAME = "platelet.app";
const PLATELET_WELCOME_EMAIL = "noreply@platelet.app";

exports.sendWelcomeEmail = async (emailAddress, recipientName, password) => {
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
                        Welcome to https://${PLATELET_DOMAIN_NAME}, ${recipientName}!
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
                        <b>This temporary password will expire in one week.</b>
                    </p>
                    <p>
                        Thank you.
                    </p>
                    `,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `Welcome to https://${PLATELET_DOMAIN_NAME}, ${recipientName}!
                    An admin has created your account for you. A temporary password has been generated for you.
                    Username: ${emailAddress}
                    Password: ${password}
                    This temporary password will expire in one week.
                    Thank you.`,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Welcome to Platelet!",
            },
        },
        Source: PLATELET_WELCOME_EMAIL,
        ReplyToAddresses: [PLATELET_WELCOME_EMAIL],
        ReturnPath: PLATELET_WELCOME_EMAIL,
    };

    return await ses.sendEmail(params).promise();
};

exports.sendTenantWelcomeEmail = async (
    emailAddress,
    recipientName,
    password
) => {
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
                        Welcome to https://${PLATELET_DOMAIN_NAME}, ${recipientName}!
                    </p>
                    <p>
                        Your account has been created. You can now start adding users to your team.
                    </p>
                    <p>
                        You will be asked to change your password on first log in.
                    </p>
                    <p>
                        <b>Username:</b> ${emailAddress}
                    </p>
                    <p>
                        <b>Password:</b> ${password}
                    </p>
                    <p>
                        <b>This temporary password will expire in one week.</b>
                    </p>
                    <p>
                        Thank you.
                    </p>
                    `,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `Welcome to https://${PLATELET_DOMAIN_NAME}, ${recipientName}!
                    Your account has been created. You can now start adding users to your team.
                    You will be asked to change your password on first log in.
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
        Source: PLATELET_WELCOME_EMAIL,
        ReplyToAddresses: [PLATELET_WELCOME_EMAIL],
        ReturnPath: PLATELET_WELCOME_EMAIL,
    };

    return await ses.sendEmail(params).promise();
};
