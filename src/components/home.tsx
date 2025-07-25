import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Settings,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react";
import ResumeBuilder from "./ResumeBuilder";
import JobDashboard from "./JobDashboard";

interface ResumeSection {
  id: string;
  type: "experience" | "education" | "skills" | "summary";
  content: any;
}

const Home = () => {
  const [activeTab, setActiveTab] = useState("resume-tool");
  const [resumeMode, setResumeMode] = useState<
    "upload" | "create" | "optimize"
  >("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [parsedSections, setParsedSections] = useState<ResumeSection[]>([]);
  const [autoApplyCredits, setAutoApplyCredits] = useState({
    used: 5,
    total: 12,
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return (
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
      setUploadedFile(e.target.files[0]);
      setAnalysisComplete(false);
    }
  };

  const handleAnalyze = () => {
    if (!uploadedFile || !jobDescription) return;

    setIsAnalyzing(true);

    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setAtsScore(72); // Mock score
    }, 2000);
  };

  const handleOptimizeResume = () => {
    // Mock parsed resume data
    const mockParsedSections: ResumeSection[] = [
      {
        id: "1",
        type: "summary",
        content: {
          text: "Experienced software developer with 5+ years in frontend development...",
        },
      },
      {
        id: "2",
        type: "experience",
        content: {
          company: "Tech Solutions Inc.",
          position: "Senior Frontend Developer",
          startDate: "2020-01",
          endDate: "Present",
          description:
            "Led development of React-based applications, improved performance by 40%...",
        },
      },
      {
        id: "3",
        type: "education",
        content: {
          institution: "State University",
          degree: "Bachelor of Science",
          field: "Computer Science",
          year: "2019",
        },
      },
      {
        id: "4",
        type: "skills",
        content: {
          list: ["JavaScript", "React", "Node.js", "TypeScript", "HTML/CSS"],
        },
      },
    ];

    setParsedSections(mockParsedSections);
    setResumeMode("optimize");
  };

  const renderResumeToolContent = () => {
    if (resumeMode === "create") {
      return <ResumeBuilder />;
    } else if (resumeMode === "optimize") {
      return (
        <ResumeBuilder
          initialSections={parsedSections}
          showAtsScore={true}
          atsScore={atsScore}
        />
      );
    } else {
      // Upload mode - show upload and analysis interface
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Upload and Input */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your existing resume for ATS analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center mb-6">
                {uploadedFile ? (
                  <div className="flex items-center justify-center flex-col">
                    <FileText className="h-10 w-10 text-primary mb-2" />
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setUploadedFile(null)}
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
                  <Label htmlFor="job-description">
                    Job Description (Optional)
                  </Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here to compare against your resume"
                    className="min-h-[150px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full mt-4"
                onClick={handleAnalyze}
                disabled={!uploadedFile || isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
              </Button>
            </CardContent>
          </Card>

          {/* Right Column - Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                {analysisComplete
                  ? "Review how your resume performs against ATS systems"
                  : "Upload your resume to see analysis"}
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
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">ATS Compatibility Score</h3>
                      <Badge
                        variant={atsScore > 80 ? "default" : "outline"}
                        className="text-sm"
                      >
                        {atsScore}%
                      </Badge>
                    </div>
                    <Progress value={atsScore} className="h-2 mb-4" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Matched Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {matchedKeywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-green-50 text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Missing Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {missingKeywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-red-50 text-xs"
                          >
                            <XCircle className="h-3 w-3 mr-1 text-red-500" />
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-medium">Quick Suggestions</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>
                          Add missing technical skills like Redux and GraphQL
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Quantify achievements with specific metrics</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Good use of action verbs in descriptions</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" onClick={handleOptimizeResume}>
                      Optimize Resume
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleOptimizeResume();
                        // Navigate to preview tab after setting optimize mode
                        setTimeout(() => {
                          const previewTab = document.querySelector(
                            '[data-value="preview"]',
                          ) as HTMLElement;
                          if (previewTab) {
                            previewTab.click();
                          }
                        }, 100);
                      }}
                    >
                      Optimize my resume
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload your resume to get started with the ATS analysis.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="font-bold text-xl">AI Genius Resume</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Auto Apply: {autoApplyCredits.used}/{autoApplyCredits.total}
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
                aria-label="Toggle dark mode"
              />
              <Moon className="h-4 w-4" />
            </div>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">
                  john@example.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Card className="bg-card">
          <CardContent className="p-0">
            <Tabs
              defaultValue="resume-tool"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b px-6 py-3">
                <TabsList className="grid grid-cols-2 w-full max-w-2xl mx-auto">
                  <TabsTrigger value="resume-tool">Resume Tool</TabsTrigger>
                  <TabsTrigger value="job-dashboard">Job Dashboard</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="resume-tool" className="mt-0">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Resume Tool</h2>
                      <p className="text-muted-foreground mb-8">
                        Upload your existing resume or create one from scratch
                      </p>

                      <div className="flex justify-center space-x-4 mb-8">
                        <Button
                          variant={
                            resumeMode === "upload" ? "default" : "outline"
                          }
                          onClick={() => setResumeMode("upload")}
                        >
                          Upload Resume
                        </Button>
                        <Button
                          variant={
                            resumeMode === "create" ? "default" : "outline"
                          }
                          onClick={() => setResumeMode("create")}
                        >
                          Create from Scratch
                        </Button>
                      </div>
                    </div>

                    {renderResumeToolContent()}
                  </div>
                </TabsContent>
                <TabsContent value="job-dashboard" className="mt-0">
                  <JobDashboard />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 ResumeATS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
