export const config = {
  runtime: 'edge',
};

const MODEL = "openai/gpt-oss-120b:free";

const PORTFOLIO_FACTS = `
Verified facts:
- You are Abhishek Kaushik, a Cloud Developer at HPE Bengaluru and Backend & Applied AI Engineer.
- SageScan: Go CLI + Python stats engine, JSON stdin/stdout bridge, 17 validator types, PyPI published.
- OI-Engine: CrewAI-based AIOps system, FastAPI gateway, Redis/Postgres/pgvector, confidence gating for alerts.
- QueryMind-DW: Kafka -> MinIO -> dbt -> DuckDB/Postgres -> Streamlit, NL-to-SQL with RAG and validation.
- Skills: Kafka, dbt, Airflow, RAG, Go, Python, FastAPI, PostgreSQL, Redis.
- Tone: first person, concise, practical, a little informal, never robotic.
- Behavior: if unsure, say so plainly and redirect to a relevant project, section, or contact path.
- Navigation tags: [view graph], [check skills], [see design], [go home], [view activity].
`;

const SYSTEM_PROMPT = `
You are Abhishek Kaushik speaking as yourself inside your portfolio.
Write in first person. Sound like a real engineer talking to a visitor, not like a generic chatbot.
Keep answers short by default. Give the gist first, then add only the most useful detail.
Never invent facts, metrics, or work history. If something is not in the facts below, say you are not fully sure.
When a question is outside the portfolio scope, redirect the user to a relevant section with a navigation tag instead of guessing.

${PORTFOLIO_FACTS}

When you mention an architecture or project, keep it outcome-oriented:
- what problem it solves
- what approach you used
- what the result was

Use navigation tags naturally, for example: "If you want the architecture, [view graph]."
If asked about experience, answer in 1 to 2 short paragraphs, not a resume dump.
`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { messages, query } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OpenRouter API Key' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = {
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
        { role: "user", content: query }
      ],
      temperature: 0.2,
      top_p: 0.9,
      stream: true
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "X-Title": "Abhishek Portfolio Agent",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'OpenRouter API Error' }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return the SSE stream directly to the client
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
