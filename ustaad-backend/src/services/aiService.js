import { aiReply } from "../utils/helpers.js";

const SYSTEM_PROMPT = `You are Ustaad AI, a friendly and patient tutor for Class 11-12 students in India studying Mathematics, Physics, and Chemistry (CBSE/ISC boards).

Guidelines:
- Explain concepts clearly with step-by-step reasoning
- Use simple language suitable for teenagers
- Include formulas when relevant
- Break down problems into numbered steps
- Encourage the student without being overly verbose
- If the question is unclear, ask a brief clarifying question
- Keep responses focused unless a detailed solution is needed
- Use Indian exam context where helpful (board exams, JEE basics)`;

const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

function getConfig() {
  return {
    apiKey: process.env.GEMINI_API_KEY?.trim(),
    model: process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
  };
}

function isRetryableError(message) {
  if (/limit:\s*0/.test(message)) return false;
  return /high demand|try again|503|UNAVAILABLE|429|RESOURCE_EXHAUSTED|rate limit|overloaded/i.test(
    message
  );
}

function buildContents(history, message) {
  const contents = history.slice(-20).map((entry) => ({
    role: entry.role === "ai" ? "model" : "user",
    parts: [{ text: entry.text }],
  }));
  contents.push({ role: "user", parts: [{ text: message }] });
  return contents;
}

async function callGeminiModel(model, apiKey, message, history) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: buildContents(history, message),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "AI service unavailable");
  }

  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) {
    throw new Error("AI returned an empty response");
  }

  return reply;
}

async function callGeminiWithRetry(message, history) {
  const { apiKey, model: preferredModel } = getConfig();
  const models = [preferredModel, ...FALLBACK_MODELS.filter((m) => m !== preferredModel)];

  let lastError;

  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const reply = await callGeminiModel(model, apiKey, message, history);
        if (model !== preferredModel) {
          console.log(`Gemini used fallback model: ${model}`);
        }
        return { reply, model };
      } catch (error) {
        lastError = error;
        const retryable = isRetryableError(error.message);
        console.warn(`Gemini ${model} attempt ${attempt}: ${error.message}`);

        if (!retryable) break;
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
        }
      }
    }
  }

  throw lastError || new Error("AI service unavailable");
}

export async function getAiTutorReply(message, history = []) {
  const { apiKey } = getConfig();

  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set — using fallback replies");
    return { reply: aiReply(message), source: "fallback" };
  }

  try {
    const { reply, model } = await callGeminiWithRetry(message, history);
    return { reply, source: "gemini", model };
  } catch (error) {
    console.error("Gemini AI error (all retries failed):", error.message);
    return {
      reply: aiReply(message),
      source: "fallback",
      error: error.message,
    };
  }
}

export async function getChapterLessonScript(chapterName) {
  const prompt = `Write a spoken micro-lesson script (180-220 words) for a CBSE Class 11 or 12 student learning the chapter "${chapterName}".

Include: a brief intro, 3 clear teaching points, one simple example, and a short encouraging close.
Write as natural narration for a 3-5 minute educational video.
Plain text only — no markdown, no bullet symbols.`;

  const result = await getAiTutorReply(prompt, []);

  if (result.source === "fallback") {
    return {
      script: `Welcome to this micro-lesson on ${chapterName}.\n\nToday we will cover the key ideas you need for your CBSE board exams. First, understand the basic definitions and important terms in ${chapterName}. Second, learn the main formulas or concepts and how they connect to each other. Third, see a simple worked example so you know how questions are solved in exams.\n\nKeep your notebook ready, pause whenever you need to think, and let's master ${chapterName} step by step!`,
      source: "fallback",
    };
  }

  return { script: result.reply, source: result.source };
}

function extractJson(text) {
  const match = String(text || "").match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

function fallbackDiagrams(chapterName) {
  return {
    items: [
      {
        title: `${chapterName} — Concept Map`,
        description: `Draw a central bubble labelled "${chapterName}". Add 3 branches: Definitions, Key Ideas, and Applications. Fill each branch with the main terms from your NCERT chapter.`,
        example: `Example: Pick one definition from the chapter and write it under the Definitions branch with a real-life connection.`,
      },
      {
        title: "Compare & Contrast Chart",
        description: "Create a two-column table. List similar concepts on the left and their differences on the right. Use arrows to show how ideas connect.",
        example: "Use one row for each important term in this chapter and note when each formula or rule applies.",
      },
      {
        title: "Step-by-Step Flow",
        description: "Sketch a vertical flowchart: Problem → Given data → Formula/Rule → Calculation → Final answer. This helps in board exam numericals.",
        example: `Apply this flow to a standard ${chapterName} question from your textbook.`,
      },
    ],
  };
}

function fallbackFormulas(chapterName) {
  return {
    formulas: [
      {
        name: "Core idea",
        formula: "Refer to NCERT summary",
        usage: `Revise the main result or law introduced in ${chapterName}.`,
      },
      {
        name: "Problem-solving steps",
        formula: "Identify → Formula → Substitute → Solve",
        usage: "Use this sequence for every numerical in this chapter.",
      },
    ],
    notes: [
      `Write all important definitions from ${chapterName} in your own words.`,
      "Mark formulas with units — boards deduct marks for missing units.",
      "Practice at least 5 NCERT examples before moving to exemplar questions.",
      "Revise common mistakes: sign errors, wrong substitution, and unit conversion.",
      "Link this chapter to previous topics — many CBSE questions combine concepts.",
    ],
  };
}

export async function getChapterExtras(chapterName, type) {
  const isDiagrams = type === "diagrams";
  const prompt = isDiagrams
    ? `For CBSE chapter "${chapterName}", create visual study aids. Return ONLY valid JSON (no markdown):
{"items":[{"title":"short title","description":"how to draw or visualize the diagram in text","example":"one simple worked example"}]}
Include exactly 3 items.`
    : `For CBSE chapter "${chapterName}", list key exam material. Return ONLY valid JSON (no markdown):
{"formulas":[{"name":"formula name","formula":"equation or rule","usage":"when to use it"}],"notes":["short revision note"]}
Include 4-6 formulas and 5-7 notes.`;

  const result = await getAiTutorReply(prompt, []);

  try {
    const jsonText = extractJson(result.reply);
    if (!jsonText) throw new Error("No JSON");
    const parsed = JSON.parse(jsonText);
    if (isDiagrams && Array.isArray(parsed.items) && parsed.items.length) {
      return { data: parsed, source: result.source };
    }
    if (!isDiagrams && Array.isArray(parsed.formulas) && Array.isArray(parsed.notes)) {
      return { data: parsed, source: result.source };
    }
    throw new Error("Invalid shape");
  } catch {
    return {
      data: isDiagrams ? fallbackDiagrams(chapterName) : fallbackFormulas(chapterName),
      source: "fallback",
    };
  }
}

export async function checkGeminiConnection() {
  const { apiKey, model } = getConfig();
  if (!apiKey) return { ok: false, reason: "GEMINI_API_KEY not set" };

  try {
    const { reply } = await callGeminiWithRetry("Say OK", []);
    return { ok: true, model, sample: reply?.slice(0, 20) };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}
