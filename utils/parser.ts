import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { scoreCV, extractCV } from "../api/deepseek";


export async function parse(pdfBuffer: Buffer) {
  // Convert Buffer to Blob
  const pdfBlob = new Blob([new Uint8Array(pdfBuffer.buffer as ArrayBuffer)], { type: "application/pdf" });

  // Load the PDF from the Blob and extract text
  const loader = new PDFLoader(pdfBlob, { parsedItemSeparator: "\n" });
  const documents = await loader.load();
  const resumeText = documents.map(doc => doc.pageContent).join("\n");


  // Use RecursiveCharacterTextSplitter to split the text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // Maximum size of each chunk
    chunkOverlap: 200, // Overlap between chunks to preserve context
    separators: ["\n\n"], // Split by paragraphs, lines, spaces, or characters
  });

  const chunks = await splitter.createDocuments([resumeText]);

  // Combine chunks into a single string for scoring (optional, if needed)
  const combinedText = chunks.map(chunk => chunk.pageContent).join("\n\n");

  return combinedText;
}

export async function parseAndScoreResume(resumeText: string, jobDescription?: string) {
  

  // Use the scoreCV function to assign an ATS score and provide feedback
  const atsResult = await scoreCV(resumeText, jobDescription);

  console.log("ATS Result:", atsResult);
  return atsResult;
}

export async function parseAndExtractResume(resumeText: string) {

  // Use the scoreCV function to assign an ATS score and provide feedback
  const extractResult = await extractCV(resumeText);

  console.log("Result:", extractResult);
  return extractResult;
}