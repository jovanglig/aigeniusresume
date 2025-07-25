import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { scoreCV } from "../api/deepseek";

export async function parseAndScoreResume(
  pdfPath: string,
  jobDescription?: string,
) {
  // Load the PDF and extract text
  const loader = new PDFLoader(pdfPath);
  const documents = await loader.load();
  const resumeText = documents.map((doc) => doc.pageContent).join("\n");

  // Use the scoreCV function to assign an ATS score and provide feedback
  const atsResult = await scoreCV(resumeText, jobDescription);

  return atsResult;
}
