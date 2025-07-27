import { ChatDeepSeek } from "@langchain/deepseek";
import dotenv from "dotenv";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const SCORING_RUBRIC = JSON.stringify(
  {
    essentials: {
      weight: 0.3,
      checks: [
        ["Name, address, or phone number missing", 15],
        [
          "Job title should be clear, standardized (e.g., Senior Data Engineer not Data Ninja)",
          10,
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
          "Skills matches job description requirements if job description provided",
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
          "Standard sections (Summary or Intro, Skills, Experience, Education, Languages) should all be present",
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
        ["No start or end dates missing for experience or education", 5],
        [
          "No irrelevant information (e.g., daily tasks without impact, unrelated jobs)",
          5,
        ],
      ],
    },
  },
  null,
  2
);

const JSON_ATS_SCORE_SCHEMA_OUTPUT = JSON.stringify(
  {
    ats_score: 85,
    feedback: {
      formatting: [
        "Header repetition on multiple pages",
        "Inconsistent bullet point styles",
      ],
      keywords: [
        "Missing: Airflow, Kafka",
        "Strong coverage of Python/Snowflake",
      ],
      structure: [
        "Skills section should be categorized",
        "Professional summary missing",
      ],
      content: [
        "Excellent quantified achievements (e.g., 'reduced latency by 60%')",
      ],
    },
    keywords: {
      missing: ["Airflow", "Kafka", "Data Governance"],
      strong: ["Python", "dbt", "Snowflake", "Terraform"],
    },
  },
  null,
  2
);

const JSON_EXTRACT_SCHEMA_OUTPUT = JSON.stringify(
  {
    name: "",
    email: "",
    phone: "",
    address: "",
    social_media: {
      linkedin: "",
      github: "",
    },
    skills: [],
    experience: [
      {
        job_title: "",
        company_name: "",
        start_date: "",
        end_date: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution_name: "",
        start_date: "",
        end_date: "",
      },
    ],
    languages: [],
  },
  null,
  2
);

const systemPrompt = PromptTemplate.fromTemplate(`
You are an ATS scoring bot. Analyze the CV and:
1. Evaluate each criterion from the rubric below.
2. Calculate scores PER CHECK (0-5 or 0-10 as specified).
3. Sum weighted scores for a final 0-100% result.
4. Provide feedback in short and clear bullet points.
5. If the job description is provided, check for keyword matches and missing skills. Name those skills that seem to be missing or are strong in the CV.

This is the scoring rubric you must follow:
{scoring_rubric}

**Rules:**
- NEVER deviate from the rubric.
- Always return the response in the following JSON format:

{json_schema_output}


This is the CV text:
{input}

Here is the job description text (if provided):
{job_description}
`);

const extractPrompt = PromptTemplate.fromTemplate(`
  You are a resume parsing bot. Parse the CV and extract the following fields:
  1. Name, email, phone number, address, and social media links (LinkedIn, GitHub)
  2. Skills
  3. Experience (job title, company name, start and end dates, description)
  4. Education (degree, institution name, start and end dates)
  5. Languages spoken

  
  **Rules:**
  - Do not deviate from the fields specified.
  - Always return the response in the following JSON format:
  
  {json_schema_output}
  
  This is the CV text:
  {input}
  `);

const llm = new ChatDeepSeek({
  model: "deepseek-reasoner",
  temperature: 0,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const ATSchain = systemPrompt.pipe(llm);
const extractChain = extractPrompt.pipe(llm);

export async function finalPrompt(resumeText: string, jobDescription?: string) {
  // Generate the final prompt with placeholders replaced
  const finalPrompt = await ATSchain.invoke({
    input: resumeText,
    job_description: jobDescription || "No job description provided",
    scoring_rubric: SCORING_RUBRIC,
    json_schema_output: JSON_ATS_SCORE_SCHEMA_OUTPUT,
  });

  return finalPrompt;
}

export async function scoreCV(resumeText: string, jobDescription?: string) {
  console.log("Sent to DeepSeek");

  // Start timing
  console.time("scoreCV Execution Time");

  const response = await ATSchain.invoke({
    input: resumeText,
    job_description: jobDescription || "No job description provided",
    scoring_rubric: SCORING_RUBRIC,
    json_schema_output: JSON_ATS_SCORE_SCHEMA_OUTPUT,
  });

  // Ensure response.content is converted to a string
  const content = String(response.content);

  // Log the raw response content for debugging
  console.log("Raw Response Content from DeepSeek:", content);

  // Use a regular expression to extract the JSON part enclosed in triple backticks
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from response content");
  }

  const jsonContent = JSON.parse(jsonMatch[1]); // Parse the extracted JSON string

  // End timing
  console.timeEnd("scoreCV Execution Time");

  return jsonContent; // Return only the JSON part
}

export async function extractCV(resumeText: string) {
  console.log("Sent to DeepSeek for extraction");

  // Start timing
  console.time("extractCV Execution Time");

  const response = await extractChain.invoke({
    input: resumeText,
    json_schema_output: JSON_EXTRACT_SCHEMA_OUTPUT,
  });

  // Ensure response.content is converted to a string
  const content = String(response.content);

  // Log the raw response content for debugging
  console.log("Raw Response Content from DeepSeek:", content);

  // Use a regular expression to extract the JSON part enclosed in triple backticks
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from response content");
  }

  const jsonContent = JSON.parse(jsonMatch[1]); // Parse the extracted JSON string

  // End timing
  console.timeEnd("extractCV Execution Time");

  return jsonContent; // Return only the JSON part
}
