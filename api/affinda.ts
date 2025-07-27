import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

class Affinda {
  private baseURL: string;
  private token: string;

  constructor(region: string) {
    this.baseURL = `https://${region}.affinda.com/v3`;
    this.token = process.env.AFFINDA_API_KEY || "";
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  async uploadDocument(file: Blob, wait: boolean = false): Promise<{ identifier: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${this.baseURL}/documents`, formData, {
      params: { wait: wait.toString() },
      headers: {
        ...this.getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async getDocumentStatus(identifier: string): Promise<{ status: string; data?: any }> {
    const response = await axios.get(`${this.baseURL}/documents/${identifier}`, {
      headers: this.getHeaders(),
    });

    return response.data;
  }
}

export default Affinda;

// Example usage:
(async () => {
  const affinda = new Affinda("your-region"); // Replace "your-region" with the appropriate region

  try {
    const file = new Blob(["Your file content"], { type: "application/pdf" }); // Replace with actual file content
    const uploadResponse = await affinda.uploadDocument(file, true);
    console.log("Uploaded document identifier:", uploadResponse.identifier);

    const statusResponse = await affinda.getDocumentStatus(uploadResponse.identifier);
    console.log("Document status:", statusResponse);
  } catch (error) {
    console.error("Error:", error);
  }
})();