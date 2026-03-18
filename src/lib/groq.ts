const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export interface ExtractedExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExtractedEducation {
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
}

export interface ExtractedProject {
  name: string;
  description: string;
  link?: string;
}

export interface ExtractedPortfolioData {
  name: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
  skills: string[];
  experience: ExtractedExperience[];
  education: ExtractedEducation[];
  projects: ExtractedProject[];
}

const portfolioJsonSchema = {
  name: "resume_portfolio_extraction",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      headline: { type: "string" },
      summary: { type: "string" },
      skills: {
        type: "array",
        items: { type: "string" }
      },
      experience: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            company: { type: "string" },
            position: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            description: { type: "string" }
          },
          required: ["company", "position", "startDate", "endDate", "description"]
        }
      },
      education: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            institution: { type: "string" },
            degree: { type: "string" },
            startYear: { type: "string" },
            endYear: { type: "string" }
          },
          required: ["institution", "degree", "startYear", "endYear"]
        }
      },
      projects: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            link: { type: "string" }
          },
          required: ["name", "description", "link"]
        }
      }
    },
    required: [
      "name",
      "email",
      "phone",
      "headline",
      "summary",
      "skills",
      "experience",
      "education",
      "projects"
    ]
  },
  strict: true
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanSkills(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return [...new Set(
    value
      .map((item) => cleanString(item))
      .filter((item) => item.length > 0)
  )];
}

function cleanExperience(value: unknown): ExtractedExperience[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = item as Record<string, unknown>;
      return {
        company: cleanString(record?.company),
        position: cleanString(record?.position),
        startDate: cleanString(record?.startDate),
        endDate: cleanString(record?.endDate),
        description: cleanString(record?.description),
      };
    })
    .filter((item) => item.company || item.position || item.description);
}

function cleanEducation(value: unknown): ExtractedEducation[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = item as Record<string, unknown>;
      return {
        institution: cleanString(record?.institution),
        degree: cleanString(record?.degree),
        startYear: cleanString(record?.startYear),
        endYear: cleanString(record?.endYear),
      };
    })
    .filter((item) => item.institution || item.degree);
}

function cleanProjects(value: unknown): ExtractedProject[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = item as Record<string, unknown>;
      return {
        name: cleanString(record?.name),
        description: cleanString(record?.description),
        link: cleanString(record?.link),
      };
    })
    .filter((item) => item.name || item.description);
}

function normalizePortfolioData(value: unknown): ExtractedPortfolioData {
  const record = (value ?? {}) as Record<string, unknown>;

  return {
    name: cleanString(record.name),
    email: cleanString(record.email),
    phone: cleanString(record.phone),
    headline: cleanString(record.headline),
    summary: cleanString(record.summary),
    skills: cleanSkills(record.skills),
    experience: cleanExperience(record.experience),
    education: cleanEducation(record.education),
    projects: cleanProjects(record.projects),
  };
}

export function isGroqConfigured() {
  return Boolean(process.env.GROQ_API_KEY);
}

export async function extractPortfolioWithGroq(rawText: string): Promise<ExtractedPortfolioData> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const prompt = [
    "Extract resume data into JSON for a developer portfolio builder.",
    "Use only facts present in the resume text.",
    "Do not invent employers, dates, links, metrics, or summaries beyond light cleanup.",
    "If a field is missing, return an empty string or empty array.",
    "Keep summary factual and concise, max 80 words.",
    "Normalize experience descriptions into readable sentences.",
    "Normalize project descriptions into concise recruiter-friendly summaries.",
    "",
    "Resume text:",
    rawText.slice(0, 18000),
  ].join("\n");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You extract structured resume data and return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: portfolioJsonSchema
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Groq returned an empty response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Groq returned invalid JSON: ${String(error)}`);
  }

  return normalizePortfolioData(parsed);
}
