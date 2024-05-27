/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const aws = require("aws-sdk");

const PLATELET_SEND_TO_EMAIL_ADDRESS = "info@platelet.app";
const PLATELET_SEND_FROM_EMAIL_ADDRESS = "info@platelet.app";

async function sendFeedbackEmail(body, senderEmail = null) {
    const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: process.env.REGION,
    });
    const plateletEmail = PLATELET_SEND_TO_EMAIL_ADDRESS;
    const Source = PLATELET_SEND_FROM_EMAIL_ADDRESS;
    const returnEmailAddress = senderEmail || PLATELET_SEND_TO_EMAIL_ADDRESS;

    const sender = senderEmail || "No email.";

    let actualBody = `From: ${sender}

    ${body}`;

    actualBody = actualBody.split("\n").join("<br />");

    const params = {
        Destination: {
            ToAddresses: [plateletEmail],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: actualBody,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: actualBody,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Feedback from",
            },
        },
        Source,
        ReplyToAddresses: [returnEmailAddress],
    };

    return await ses.sendEmail(params).promise();
}

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const emailData = {
        emailAddress: event.arguments.emailAddress,
        body: event.arguments.body,
    };
    try {
        await sendFeedbackEmail(emailData.body, emailData.emailAddress);
        return { successState: true };
    } catch (e) {
        throw e;
    }
};
