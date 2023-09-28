import { DiscussServiceClient } from "@google-ai/generativelanguage"
import { GoogleAuth } from "google-auth-library"
import { NextResponse } from "next/server"

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.PALM_API_KEY;

const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY!),
});

export async function POST(request: Request) {
    const data: any = await request.json()
    const messages = [data];
    console.log('Message to ChatBot => ', messages);
    const result = await client.generateMessage({
        // required, which model to use to generate the result
        model: MODEL_NAME,
        // optional, 0.0 always uses the highest-probability result
        temperature: 0.25,
        // optional, how many candidate results to generate
        candidateCount: 1,
        // optional, number of most probable tokens to consider for generation
        topK: 40,
        // optional, for nucleus sampling decoding strategy
        topP: 0.95,
        prompt: {
            // optional, sent on every request and prioritized over history
            messages: messages,
        },
    })
    try {
        if (result[0] && result[0].candidates?.length! > 0) {
            console.log(true);
            // console.log(result[0].candidates, 'result 5555');     
            // return 
        } else {
            console.log(false);
        }
        // if(result[0].candidates)
        // console.log(JSON.stringify(result, null, 2));
        // messages.push()
        // return NextResponse.json(result)
        return NextResponse.json({ name: 'John Doe' })
    } catch (err: any) {
        console.error(err, 'error')
        return new NextResponse(err, {
            status: 400,
        });
    }
}

// Sorry..., We Couldn't Generate A Reply