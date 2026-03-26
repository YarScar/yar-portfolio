import 'dotenv/config';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

function parseOpenAIErrorMessage(data) {
  const message = data?.error?.message;
  return typeof message === 'string' && message.trim() ? message.trim() : 'AI enhancement failed';
}

function shouldTryAnotherModel(status, data) {
  if (status !== 400 && status !== 404) return false;

  const message = parseOpenAIErrorMessage(data).toLowerCase();
  return message.includes('model') || message.includes('not found') || message.includes('do not have access');
}

function extractOutputText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (!Array.isArray(data?.output)) return '';

  for (const item of data.output) {
    if (!Array.isArray(item?.content)) continue;

    for (const contentItem of item.content) {
      if (typeof contentItem?.text === 'string' && contentItem.text.trim()) {
        return contentItem.text.trim();
      }
    }
  }

  return '';
}

export async function POST(request) {
  try {
    const body = await request.json();
    const description = typeof body?.description === 'string' ? body.description.trim() : '';

    if (!description) {
      return new Response(JSON.stringify({ message: 'Description is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ message: 'OPENAI_API_KEY is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const configuredModel = (process.env.OPENAI_MODEL || '').trim();
    const modelCandidates = Array.from(new Set([
      configuredModel,
      'gpt-4o-mini',
      'gpt-4.1-mini'
    ].filter(Boolean)));

    let lastErrorMessage = 'AI enhancement failed';
    let lastStatus = 502;

    for (const model of modelCandidates) {
      const openaiResponse = await fetch(OPENAI_RESPONSES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model,
          input: [
            {
              role: 'system',
              content: 'You are a professional software engineer. Your goal is to improve portfolio project descriptions. Return a polished, concise version in plain text only. Keep it to 1-2 sentences and preserve the original meaning. If you get a readme your job is to read the read me and pull a 2-3 sentence description of the project.'
            },
            {
              role: 'user',
              content: description
            }
          ]
        })
      });

      const openaiData = await openaiResponse.json();

      if (openaiResponse.ok) {
        const enhancedDescription = extractOutputText(openaiData);

        if (!enhancedDescription) {
          return new Response(JSON.stringify({ message: 'No enhanced description returned' }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ description: enhancedDescription }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const upstreamMessage = parseOpenAIErrorMessage(openaiData);
      lastErrorMessage = upstreamMessage;
      lastStatus = openaiResponse.status >= 400 && openaiResponse.status < 600
        ? openaiResponse.status
        : 502;

      console.error(`OpenAI enhancement error for model ${model}:`, openaiData);

      if (!shouldTryAnotherModel(openaiResponse.status, openaiData)) {
        break;
      }
    }

    return new Response(JSON.stringify({ message: lastErrorMessage }), {
      status: lastStatus,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('POST /api/ai/enhance-description error', err);
    return new Response(JSON.stringify({ message: 'Failed to enhance description' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
