export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const { messages, systemPrompt } = await request.json();
      
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Fixed: Using the standard model name 'gemini-1.5-flash'
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: contents,
          system_instruction: { parts: [{ text: systemPrompt }] }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // This will tell us if the API key is invalid or if the model name is still wrong
        return new Response(JSON.stringify({ error: data.error?.message || "Gemini API Error" }), { 
          status: response.status, 
          headers: corsHeaders 
        });
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now.";
      return new Response(JSON.stringify({ content: aiText }), { headers: corsHeaders });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  },
};
