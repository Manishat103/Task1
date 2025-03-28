const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Events";

exports.handler = async (event) => {
    try {
        const parsedBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { principalId, content } = parsedBody;
        
        if (!principalId || typeof content !== 'object') {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid request payload" })
            };
        }

        const newEvent = {
            id: uuidv4(),
            principalId,
            createdAt: new Date().toISOString(),
            body: content
        };

        await dynamoDB.put({
            TableName: TABLE_NAME,
            Item: newEvent
        }).promise();

        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: newEvent })
        };
    } catch (error) {
        console.error("Error saving event:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Internal Server Error" })
        };
    }
};
