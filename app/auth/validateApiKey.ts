import { NextResponse } from "next/server";

export default async function validateApiKey(request: any) {
    const apiKey = request.headers.get("xApiKey");
    const AUTH_API_KEY = process.env.AUTH_API_KEY
    console.log(apiKey, 'apiKey ++++');
    console.log(AUTH_API_KEY, 'AUTH_API_KEY ++++');
    if (apiKey !== AUTH_API_KEY) {
        console.log('AUTH API KEY WRONG!');
        const errorObj = {
            status: 401,
            error: "Unauthorized",
        };
        return new NextResponse(JSON.stringify(errorObj), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    return null
}
