// src/lib/groq/client.ts
import Groq from "groq-sdk"

if (!process.env.NEXT_GROQ_API_KEY) {
  throw new Error("Missing NEXT_GROQ_API_KEY environment variable")
}

export const groq = new Groq({
  apiKey: process.env.NEXT_GROQ_API_KEY,
})
