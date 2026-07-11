export const chatWithGroq = async (req, res) => {
  try {
    const { messages, tools } = req.body;
    
    // Use the backend GROQ_API_KEY
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'System Error: GROQ_API_KEY is missing in the server environment (.env). Please add it.' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
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
    res.json(data);
  } catch (error) {
    console.error("[ChatBot] controller error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
