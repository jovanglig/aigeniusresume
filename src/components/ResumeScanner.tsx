import React, { useState } from "react";
import axiosClient from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface SuggestionProps {
  title: string;
  description: string;
  type: "missing" | "improvement" | "good";
}

const Suggestion = (
  { title, description, type }: SuggestionProps = {
    title: "Suggestion Title",
    description: "Suggestion description with details about what to improve.",
    type: "improvement",
  },
) => {
  const icons = {
    missing: <XCircle className="h-5 w-5 text-destructive" />,
    improvement: <AlertCircle className="h-5 w-5 text-amber-500" />,
    good: <CheckCircle className="h-5 w-5 text-green-500" />,
  };

  return (
    <div className="flex items-start space-x-3 p-3 border rounded-md mb-3 bg-background">
      <div className="mt-0.5">{icons[type]}</div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const ResumeScanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [atsScore, setAtsScore] = useState(0);

  // Mock data for demonstration
  const matchedKeywords = [
    "React",
    "TypeScript",
    "UI/UX",
    "Frontend Development",
    "JavaScript",
  ];
  const missingKeywords = ["Redux", "GraphQL", "CI/CD", "Agile"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("File selected:", e.target.files[0]); // Debug log
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    console.log("handleAnalyze triggered");
    if (!file) {
      console.log("File is missing");
      return;
    }
  
    setIsAnalyzing(true);
  
    const formData = new FormData();
    formData.append("resume", file);
    if (jobDescription) {
      formData.append("jobDescription", jobDescription);
    }
  
    try {
      const response = await axiosClient.post("/api/analyze-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const data = response.data;
      setAtsScore(data.ats_score);
      // Update other state variables with analysis results if needed
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Error analyzing resume:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6">Resume Scanner</h1>
      <p className="text-muted-foreground mb-8">
        Optimize your resume for ATS systems by analyzing it against job
        descriptions
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Upload and Input */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your existing resume for ATS analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center mb-6">
                {file ? (
                  <div className="flex items-center justify-center flex-col">
                    <FileText className="h-10 w-10 text-primary mb-2" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setFile(null)}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-col">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop your resume here or click to browse
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="max-w-sm"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Job Descriptions</h3>
                  <Textarea
                    placeholder="Paste the job description heres to compare against your resumes"
                    className="min-h-[150px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Resumew"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Analysis Results */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                {analysisComplete
                  ? "Review how your resume matches the job description"
                  : "Uploads your resume and job description to see analysis"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="mb-4 text-muted-foreground">
                    Analyzing your resume...
                  </p>
                  <Progress value={45} className="w-full max-w-md" />
                </div>
              ) : analysisComplete ? (
                <div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">ATS Compatibility Score</h3>
                      <Badge
                        variant={atsScore > 80 ? "default" : "outline"}
                        className="text-sm"
                      >
                        {atsScore}%
                      </Badge>
                    </div>
                    <Progress value={atsScore} className="h-2" />
                  </div>

                  <Tabs defaultValue="keywords">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="keywords">Keywords</TabsTrigger>
                      <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                      <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>

                    <TabsContent value="keywords">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">
                            Matched Keywords
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {matchedKeywords.map((keyword, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-green-50"
                              >
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-3">
                            Missing Keywords
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {missingKeywords.map((keyword, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-red-50"
                              >
                                <XCircle className="h-3 w-3 mr-1 text-red-500" />
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="suggestions">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          <Suggestion
                            title="Add missing technical skills"
                            description="Consider adding Redux and GraphQL to your skills section as they are mentioned in the job description."
                            type="missing"
                          />
                          <Suggestion
                            title="Quantify your achievements"
                            description="Add metrics to your work experience to demonstrate impact (e.g., improved performance by X%)."
                            type="improvement"
                          />
                          <Suggestion
                            title="Strong education section"
                            description="Your education section is well-formatted and includes relevant coursework."
                            type="good"
                          />
                          <Suggestion
                            title="Improve work experience descriptions"
                            description="Use more action verbs and focus on achievements rather than responsibilities."
                            type="improvement"
                          />
                          <Suggestion
                            title="Add Agile methodology experience"
                            description="The job requires Agile experience, but this isn't mentioned in your resume."
                            type="missing"
                          />
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="comparison">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            Your Resume
                          </h3>
                          <div className="border rounded-md p-4 h-[350px] overflow-auto bg-muted/20">
                            <p className="text-sm text-muted-foreground">
                              [Your resume content would appear here with
                              highlighted sections showing matches and
                              mismatches]
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            Optimized Version
                          </h3>
                          <div className="border rounded-md p-4 h-[350px] overflow-auto bg-muted/20">
                            <p className="text-sm text-muted-foreground">
                              [An optimized version of your resume would appear
                              here with suggested changes highlighted]
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload your resume and paste a job description to get
                    started with the ATS analysis.
                  </p>
                </div>
              )}
            </CardContent>
            {analysisComplete && (
              <CardFooter>
                <Button className="w-full">
                  Optimize Resume <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeScanner;
