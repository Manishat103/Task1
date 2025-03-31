exports.handler = async (event) => {
    const path = event.rawPath;
    const method = event.requestContext.http.method;

    if (path === "/weather" && method === "GET") {
        try {
            const url = "https://api.open-meteo.com/v1/forecast?latitude=50.4375&longitude=30.5&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&current=temperature_2m,wind_speed_10m&timezone=Europe/Kiev";

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }

            const data = await response.json();

            return {
                statusCode: 200,
                body: JSON.stringify(data),
                headers: { "content-type": "application/json" },
                isBase64Encoded: false
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message }),
                headers: { "content-type": "application/json" }
            };
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            statusCode: 400,
            message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
        }),
        headers: { "content-type": "application/json" },
        isBase64Encoded: false
    };
};
