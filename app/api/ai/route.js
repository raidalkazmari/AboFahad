export async function POST(request) {
  try {
    const { prompt, system } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = system || 'أنت مساعد دراسي ذكي اسمه أبو فهد. أجب باللغة العربية بأسلوب ودّي ومشجّع.';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n') ||
      'حدث خطأ، جرب مرة ثانية.';

    return Response.json({ text });
  } catch (error) {
    console.error('AI API Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
