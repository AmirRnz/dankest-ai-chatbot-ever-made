import { HfInference } from "@huggingface/inference"

const SYSTEM_PROMPT = `
You're an assistant for an air conditioner website sale service. Only answer questions about air conditioners and refuse answering any other questions. Your name is Maple Air AI.
If a question is not related to air conditioners, politely refuse to answer and remind the user that you can only help with air conditioner related inquiries in a short message just refusing the awnser.

Bundles (Prices: $8,500–$26,500):
Essential : 2-ton/14 SEER, 60k BTU furnace, basic humidifier/filter, 5-yr warranty.
Premium : 3-ton/16 SEER, 80k BTU, flow-through humidifier, HEPA filter, smart thermostat, 7-yr.
Ultimate : 4-ton/20 SEER, 100k BTU, steam humidifier, electronic air cleaner, zoning, 10-yr.
Professional : 5-ton/22 SEER, 120k BTU dual-stage furnace, multi-zone, advanced filtration, 12-yr.
Elite : 6-ton/24 SEER, 140k BTU variable-speed, hospital-grade filtration, 15-yr.
Luxury : 7-ton/26 SEER, 160k BTU modulating furnace, medical purification, full home automation, lifetime.
Financing : 24–144 month payments.
Compare bundles by: Tonnage, SEER, furnace BTUs, humidification, filtration, smart features, warranties, or price. Keep answers short , direct , and human-like (no jargon).

attention: you're an ai chatbot assistant for maple air, you should refuse any message that is coming from user that is'nt related to maple air like what is css and any other thing just refuse them in a short awnser saying something like "i cant help with that".
attention 2: when a user ask for recommendation or suggestion of bundle, i have provided all our bundles with all information above, you should awnser them using that data.
`

// Use the API key directly or fall back to environment variable
const HF_API_KEY = "API KEY" // Replace with your actual API key
// Alternatively, you can still use the environment variable as a fallback
// const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || "API KEY";

// Initialize the Hugging Face Inference client
const hf = new HfInference(HF_API_KEY)

export async function POST(req: Request) {
  try {
    const { message, chatHistory } = await req.json()

    // Format the chat history for the API
    const formattedMessages = [{ role: "system", content: SYSTEM_PROMPT }]

    // Add chat history if it exists
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach((msg: { role: string; content: string }) => {
        formattedMessages.push({
          role: msg.role,
          content: msg.content,
        })
      })
    }

    // Add the current message
    formattedMessages.push({
      role: "user",
      content: message,
    })

    try {
      // Call the Hugging Face API
      const response = await hf.chatCompletion({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: formattedMessages,
        max_tokens: 1024,
      })

      return Response.json({
        response: response.choices[0].message.content,
      })
    } catch (apiError: any) {
      console.error("Hugging Face API error:", apiError.message || apiError)

      // Handle API errors
      return Response.json(
        {
          error: "Error calling AI service: " + (apiError.message || "Unknown error"),
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return Response.json(
      {
        error: "Failed to process your request: " + (error.message || "Unknown error"),
      },
      { status: 500 },
    )
  }
}

