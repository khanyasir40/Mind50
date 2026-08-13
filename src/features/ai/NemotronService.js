/* ==========================================================================
   NVIDIA NEMOTRON AI SERVICE — Streaming Chat with Reasoning
   Uses nvidia/nemotron-3-ultra-550b-a55b via OpenAI-compatible API
   ========================================================================== */

const API_BASE = '/api/nvidia';
const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b';

// Storage key for the API key (persisted in localStorage)
const API_KEY_STORAGE = 'neurovault_nvidia_api_key';

export const NemotronService = {
  /**
   * Get stored API key from localStorage
   */
  getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  },

  /**
   * Save API key to localStorage
   */
  setApiKey(key) {
    localStorage.setItem(API_KEY_STORAGE, key);
  },

  /**
   * Check if API key is configured
   */
  hasApiKey() {
    return !!this.getApiKey();
  },

  /**
   * Build system prompt for the AI Brain Coach
   */
  buildSystemPrompt(userState) {
    const { user, scores, gameProgress } = userState || {};

    // Compute some performance stats
    const gamesPlayed = Object.keys(gameProgress || {}).length;
    const totalAttempts = Object.values(gameProgress || {}).reduce((sum, g) => sum + (g.attemptsCount || 0), 0);
    const avgAccuracy = Object.values(gameProgress || {}).filter(g => g.lastAccuracy != null).reduce((sum, g, _, arr) => sum + g.lastAccuracy / arr.length, 0);

    const scoreEntries = Object.entries(scores || {})
      .map(([domain, val]) => `${domain}: ${val}/1000`)
      .join(', ');

    return `You are NEURO, an elite AI Brain Coach powered by NVIDIA Nemotron inside the NeuroVault cognitive training platform.

## Your Role
- Analyze cognitive performance data and provide evidence-based insights
- Recommend specific games and training strategies to strengthen weak domains
- Explain the neuroscience behind cognitive skills (memory, attention, speed, spatial, reasoning)
- Motivate the user with clear, actionable advice
- Answer any brain science, psychology, or cognitive training questions

## User Profile
- Name: ${user?.name || 'Explorer'}
- Level: ${user?.level || 1} (XP: ${user?.xp || 0})
- Daily Streak: ${user?.streak || 0} days
- Unique Games Played: ${gamesPlayed}/50
- Total Attempts: ${totalAttempts}
- Average Accuracy: ${avgAccuracy ? Math.round(avgAccuracy) : 'N/A'}%

## Domain Scores (0-1000)
${scoreEntries || 'No scores recorded yet'}

## Top Games Played (by attempts)
${Object.entries(gameProgress || {})
  .sort((a, b) => (b[1].attemptsCount || 0) - (a[1].attemptsCount || 0))
  .slice(0, 8)
  .map(([id, g]) => `- ${id}: Best=${g.bestScore || 0}, Attempts=${g.attemptsCount || 0}, Accuracy=${g.lastAccuracy || 'N/A'}%`)
  .join('\n') || '- No games played yet'}

## Communication Style
- Be concise but insightful — maximum 2-3 short paragraphs
- Use emoji sparingly for clarity (🧠 ⚡ 🎯 📊)
- Reference specific game names and domains when giving advice
- Be encouraging but honest about weak areas
- When doing analysis, show your reasoning step by step`;
  },

  /**
   * Stream a chat completion from NVIDIA Nemotron
   * @param {Array} messages - Chat history [{role, content}]
   * @param {Object} userState - User state for context
   * @param {Function} onReasoningChunk - Called with reasoning token chunks
   * @param {Function} onContentChunk - Called with content token chunks
   * @param {Function} onDone - Called when stream completes
   * @param {Function} onError - Called on error
   * @returns {AbortController} - Controller to cancel the request
   */
  streamChat({ messages, userState, onReasoningChunk, onContentChunk, onDone, onError }) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      onError?.(new Error('NVIDIA API key not configured'));
      return null;
    }

    const controller = new AbortController();

    const fullMessages = [
      { role: 'system', content: this.buildSystemPrompt(userState) },
      ...messages,
    ];

    const requestBody = {
      model: MODEL,
      messages: fullMessages,
      temperature: 0.8,
      top_p: 0.92,
      max_tokens: 4096,
      stream: true,
      extra_body: {
        chat_template_kwargs: { enable_thinking: true },
        reasoning_budget: 4096,
      },
    };

    (async () => {
      try {
        const response = await fetch(`${API_BASE}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => 'Unknown error');
          throw new Error(`API Error ${response.status}: ${errText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const jsonStr = trimmed.slice(6);
            if (jsonStr === '[DONE]') {
              onDone?.();
              return;
            }

            try {
              const chunk = JSON.parse(jsonStr);
              if (!chunk.choices || chunk.choices.length === 0) continue;

              const delta = chunk.choices[0].delta;

              // Reasoning content (thinking tokens)
              const reasoning = delta?.reasoning_content;
              if (reasoning) {
                onReasoningChunk?.(reasoning);
              }

              // Regular content
              if (delta?.content != null) {
                onContentChunk?.(delta.content);
              }

              // Check for finish
              if (chunk.choices[0].finish_reason) {
                onDone?.();
                return;
              }
            } catch (parseErr) {
              // Skip malformed JSON chunks
            }
          }
        }

        onDone?.();
      } catch (err) {
        if (err.name === 'AbortError') {
          onDone?.();
        } else {
          onError?.(err);
        }
      }
    })();

    return controller;
  },
};
