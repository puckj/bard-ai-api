import { NextResponse } from "next/server";
import validateApiKey from "@/app/auth/validateApiKey";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { DiscussServiceClient } from "@google-ai/generativelanguage";
// import { GoogleAuth } from "google-auth-library";

// const MODEL_NAME = "models/chat-bison-001";
// const PALM_API_KEY = process.env.PALM_API_KEY;
// const client = new DiscussServiceClient({
//   authClient: new GoogleAuth().fromAPIKey(PALM_API_KEY!),
// });

const genAI = new GoogleGenerativeAI(process.env.PALM_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request: Request) {
  try {
    const apiKeyValidationResult = await validateApiKey(request);
    // Check if the apiKeyValidationResult is not an error response
    if (apiKeyValidationResult !== null) {
      // API key is invalid, return the error response
      return apiKeyValidationResult;
    }

    const data: any = await request.json();
    console.log("[Message to AI] : ", data);

    const result = await model.generateContent(data.content);
    console.log("[result from AI] : ", result.response.text());

    let responseText = null;
    if (result && result.response.text() !== null) {
      responseText = result.response.text().trim();
    } else {
      responseText = "Sorry..., We Couldn't Generate A Reply";
    }
    return NextResponse.json({ status: 200, response_text: responseText });

    // const result: any = await client.generateMessage({
    //   // required, which model to use to generate the result
    //   model: MODEL_NAME,
    //   // optional, 0.0 always uses the highest-probability result
    //   temperature: 0.25,
    //   // optional, how many candidate results to generate
    //   candidateCount: 1,
    //   // optional, number of most probable tokens to consider for generation
    //   topK: 40,
    //   // optional, for nucleus sampling decoding strategy
    //   topP: 0.95,
    //   prompt: {
    //     // optional, sent on every request and prioritized over history
    //     messages: [data],
    //   },
    // });
    // let responseText = null;
    // console.log(result[0], " [reponse result]");
    // if (result[0] && result[0].candidates?.length! > 0) {
    //   responseText = result[0].candidates[0].content;
    // } else {
    //   responseText = "Sorry..., We Couldn't Generate A Reply";
    // }
    // return NextResponse.json({ status: 200, response_text: responseText });
  } catch (err: any) {
    console.error(err, "error [bard/routes.ts]");
    return new NextResponse(JSON.parse(err.message), {
      status: 400,
    });
  }
}
