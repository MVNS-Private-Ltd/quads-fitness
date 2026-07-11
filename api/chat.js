export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, tools } = req.body;
    
    // Read the key from Vercel's environment variables
    const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'System Error: GROQ_API_KEY is missing in Vercel environment variables.' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        tools: tools,
        tool_choice: 'auto',
        max_tokens: 300,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ChatBot] Groq API error:", errorText);
      return res.status(response.status).json({ error: 'Groq API error' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("[ChatBot] Vercel function error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
