import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "My Next.js App",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-nano-30b-a3b:free",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error }, { status: response.status });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
      async start(controller) {
        // @ts-ignore
        const reader = response.body.getReader();
        let buffer = ""; // <--- THIS BUFFER FIXES THE STUCK LOADING

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            // Split by double newline (standard SSE separator)
            const lines = buffer.split("\n\n");
            
            // IMPORTANT: Keep the last part in the buffer because it might be incomplete!
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine.startsWith("data:")) continue;
              
              const dataStr = trimmedLine.replace("data:", "").trim();
              
              if (dataStr === "[DONE]") {
                controller.close();
                return;
              }

              try {
                const json = JSON.parse(dataStr);
                const text = json.choices[0]?.delta?.content || "";
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (e) {
                // If it fails here, it's usually a junk packet, safe to ignore
                // console.error("Error parsing JSON", e); 
              }
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}