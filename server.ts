import express from "express";
import multer from "multer";
import cors from "cors";
import {
  parse,
  parseAndScoreResume,
  parseAndExtractResume,
} from "./utils/parser";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const app = express();
const upload = multer();
const PORT = 5000;

// Configure CORS to allow requests from the frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Updated to match the frontend's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.post("/api/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    console.log("Received request at /api/analyze-resume");
    console.log("Request body:", req.body);

    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Debug log to confirm file details
    console.log("Uploaded file details:");
    console.log("Original name:", req.file.originalname);
    console.log("MIME type:", req.file.mimetype);
    console.log("File size:", req.file.size);

    const pdfBuffer = req.file.buffer; // Use the uploaded file buffer
    const jobDescription =
      req.body.jobDescription || "No job description provided";

    console.log("Job description:", jobDescription);

    // Parse the PDF buffer to extract text
    const resumeText = await parse(pdfBuffer);

    // Run parseAndExtractResume and parseAndScoreResume concurrently
    const [extractedData, analysisResult] = await Promise.all([
      parseAndExtractResume(resumeText), // Extract data from resume
      parseAndScoreResume(resumeText, jobDescription), // Analyze resume
    ]);

    // Combine the results and send them in the response
    res.json({ extractedData, analysisResult });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
