import { ChatDeepSeek } from "@langchain/deepseek";
import dotenv from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const SCORING_RUBRIC = {
  essentials: {
    weight: 0.3,
    checks: [
      ["Name, address, or phone number missing", 15],
      [
        "Job title should be clear, standardized (e.g., Senior Data Engineer not Data Ninja)",
        15,
      ],
      ["Social media links (LinkedIn, GitHub) should be present", 5],
    ],
  },
  formatting: {
    weight: 0.2,
    checks: [
      [
        "Consistent bullet points with no more than 300 characters per bullet point",
        5,
      ],
      ["ATS-friendly fonts (Arial/Times)", 5],
      ["No tables/images", 5],
      ["Section headers clear", 5],
    ],
  },

  keywords: {
    weight: 0.3,
    checks: [
      [
        "Skills matches job description keywords if job description provided",
        10,
      ],
      ["Industry-standard terms for skills", 10],
      ["No jargon", 5],
      ["No more than 15 different skills", 5],
    ],
  },
  structure: {
    weight: 0.2,
    checks: [
      ["Reverse chronological order for experience and education", 5],
      [
        "Standard sections (Summary, Skills, Experience, Education) should all be present",
        10,
      ],
      ["No header/footer repetition", 5],
    ],
  },
  content: {
    weight: 0.3,
    checks: [
      ["Quantified/measurable achievements (e.g., 'Improved X by Y%')", 5],
      ["Technical depth without fluff", 5],
      ["Using action verbs in experience description bullet points", 5],
      [
        "Use of bullet points to describe experience, but not more than 6 for each experience",
        5,
      ],
      ["One or more start or end dates missing for experience or education", 5],
      [
        "No irrelevant information (e.g., daily tasks without impact, unrelated jobs)",
        5,
      ],
    ],
  },
};

const systemPrompt = ChatPromptTemplate.fromTemplate(`
You are an ATS scoring bot. Analyze the CV and:
1. Evaluate each criterion from the rubric below
2. Calculate scores PER CHECK (0-5 or 0-10 as specified)
3. Sum weighted scores for final 0-100% result
4. Provide feedback in short and clear bullet points

SCORING_RUBRIC = ${JSON.stringify(SCORING_RUBRIC, null, 2)}

**Rules:**
- NEVER deviate from the rubric
- For checks like "Consistent bullet points":
  - 5 pts if perfect
  - 3 pts if minor issues
  - 0 pts if missing
- Return JSON with raw scores + final percentage:


Here is an example output:
\`\`\`json
{
  "ats_score": 85,
  "feedback": {
    "formatting": [
      "Header repetition on multiple pages",
      "Inconsistent bullet point styles"
    ],
    "keywords": [
      "Missing: Airflow, Kafka",
      "Strong coverage of Python/Snowflake"
    ],
    "structure": [
      "Skills section should be categorized",
      "Professional summary missing"
    ],
    "content": [
      "Excellent quantified achievements (e.g. 'reduced latency by 60%')"
    ]
  },
  "keywords": {
    "missing": ["Airflow", "Kafka", "Data Governance"],
    "strong": ["Python", "dbt", "Snowflake", "Terraform"]
  }
}
\`\`\`
`);

const llm = new ChatDeepSeek({
  model: "deepseek-chat-7b",
  temperature: 0,
}).withStructuredOutput({
  schema: {
    ats_score: "number",
    feedback: {
      formatting: ["string"],
      keywords: ["string"],
      structure: ["string"],
      content: ["string"],
    },
    keywords: {
      missing: ["string"],
      strong: ["string"],
    },
  },
});

const chain = systemPrompt.pipe(llm);

export async function scoreCV(cvText: string, jobDescription?: string) {
  const response = await chain.invoke({
    input: cvText,
    job_description: jobDescription || "",
  });

  return response;
}
