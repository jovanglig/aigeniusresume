import React, { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  PlusCircle,
  Trash2,
  Download,
  FileText,
  MoveHorizontal,
  ChevronRight,
  Upload,
  X,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResumeSection {
  id: string;
  type: "experience" | "education" | "skills" | "summary";
  content: any;
}

interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  recommended: boolean;
}

interface ResumeBuilderProps {
  initialSections?: ResumeSection[];
  showAtsScore?: boolean;
  atsScore?: number;
}

const ResumeBuilder = ({
  initialSections,
  showAtsScore = false,
  atsScore: propAtsScore,
}: ResumeBuilderProps = {}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("harvard");
  const [activeTab, setActiveTab] = useState<string>("templates");
  const [sections, setSections] = useState<ResumeSection[]>(
    initialSections || [
      {
        id: "1",
        type: "summary",
        content: {
          text: "Experienced professional with a track record of success...",
        },
      },
      {
        id: "2",
        type: "experience",
        content: {
          company: "ABC Corp",
          position: "Senior Developer",
          startDate: "2020-01",
          endDate: "Present",
          description:
            "Led development team in creating innovative solutions...",
        },
      },
      {
        id: "3",
        type: "education",
        content: {
          institution: "University of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science",
          year: "2019",
        },
      },
      {
        id: "4",
        type: "skills",
        content: {
          list: [
            "JavaScript",
            "React",
            "Node.js",
            "TypeScript",
            "UI/UX Design",
          ],
        },
      },
    ],
  );
  const [atsScore, setAtsScore] = useState<number>(propAtsScore || 78);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates: ResumeTemplate[] = [
    {
      id: "harvard",
      name: "Harvard",
      thumbnail:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
      description:
        "Clean, traditional format preferred by top universities and corporations",
      recommended: true,
    },
    {
      id: "modern",
      name: "Modern",
      thumbnail:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
      description: "Contemporary design with professional photo section",
      recommended: false,
    },
    {
      id: "simple",
      name: "Simple",
      thumbnail:
        "https://images.unsplash.com/photo-1586282391129-76a6df230234?w=400&q=80",
      description: "Minimalist layout focusing on content clarity",
      recommended: false,
    },
    {
      id: "marco",
      name: "Marco",
      thumbnail:
        "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=400&q=80",
      description: "Colorful sidebar design with modern typography",
      recommended: false,
    },
    {
      id: "executive",
      name: "Executive",
      thumbnail:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
      description: "Professional layout ideal for senior-level positions",
      recommended: false,
    },
    {
      id: "creative",
      name: "Creative",
      thumbnail:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&q=80",
      description: "Artistic design perfect for creative industries",
      recommended: false,
    },
  ];

  const addSection = (type: ResumeSection["type"]) => {
    const newSection: ResumeSection = {
      id: Date.now().toString(),
      type,
      content:
        type === "experience"
          ? {
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              description: "",
            }
          : type === "education"
            ? { institution: "", degree: "", field: "", year: "" }
            : type === "skills"
              ? { list: [] }
              : { text: "" },
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const updateSection = (id: string, content: any) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, content } : section,
      ),
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for cropping to square
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        // Calculate crop position (center crop)
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        // Draw cropped image
        ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size);

        // Convert to data URL
        const croppedImageUrl = canvas.toDataURL("image/jpeg", 0.8);
        setProfileImage(croppedImageUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadPDF = async () => {
    if (!resumePreviewRef.current) return;

    setIsDownloading(true);

    try {
      // Create canvas from the resume preview
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: resumePreviewRef.current.scrollWidth,
        height: resumePreviewRef.current.scrollHeight,
      });

      // Calculate dimensions for PDF (8.5 x 11 inches)
      const imgWidth = 8.5;
      const imgHeight = 11;
      const imgData = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [imgWidth, imgHeight],
      });

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Download the PDF
      pdf.save("resume-ats-optimized.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderResumePreview = () => {
    const templateStyles = {
      harvard: "p-8 h-full bg-white text-black",
      modern: "h-full bg-slate-700 text-white flex",
      simple: "p-8 h-full bg-white text-black",
      marco: "h-full bg-white text-black flex",
      executive: "p-8 h-full bg-white text-black",
      creative:
        "p-8 h-full bg-gradient-to-br from-purple-100 to-pink-100 text-gray-800",
    };

    const currentStyle =
      templateStyles[selectedTemplate as keyof typeof templateStyles] ||
      templateStyles.harvard;

    if (selectedTemplate === "modern") {
      return (
        <div className={currentStyle}>
          <div className="w-1/3 bg-slate-800 p-6 text-white">
            <div className="w-20 h-20 bg-blue-500 rounded-full mb-4 mx-auto overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500"></div>
              )}
            </div>
            <h4 className="font-semibold text-sm mb-3 text-blue-300">
              CONTACT
            </h4>
            <div className="text-xs space-y-1 mb-4">
              <p>john.doe@example.com</p>
              <p>(123) 456-7890</p>
              <p>New York, NY</p>
            </div>
            <h4 className="font-semibold text-sm mb-3 text-blue-300">
              EDUCATION
            </h4>
            {sections
              .filter((s) => s.type === "education")
              .map((section) => (
                <div key={section.id} className="text-xs mb-3">
                  <p className="font-medium">{section.content.institution}</p>
                  <p>{section.content.degree}</p>
                  <p>{section.content.year}</p>
                </div>
              ))}
            <h4 className="font-semibold text-sm mb-3 text-blue-300">SKILLS</h4>
            {sections
              .filter((s) => s.type === "skills")
              .map((section) => (
                <div key={section.id} className="text-xs">
                  {Array.isArray(section.content.list) &&
                    section.content.list.map((skill: string, index: number) => (
                      <div
                        key={index}
                        className="bg-slate-600 text-white px-2 py-1 rounded mb-1 text-xs flex items-center justify-center"
                      >
                        {skill}
                      </div>
                    ))}
                </div>
              ))}
          </div>
          <div className="w-2/3 p-6 bg-white text-black">
            <h1 className="text-2xl font-bold mb-1">John Doe</h1>
            <p className="text-gray-600 mb-4">Senior Software Engineer</p>

            {sections
              .filter((s) => s.type === "summary")
              .map((section) => (
                <div key={section.id} className="mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-blue-600">
                    SUMMARY
                  </h2>
                  <p className="text-sm">{section.content.text}</p>
                </div>
              ))}

            {sections
              .filter((s) => s.type === "experience")
              .map((section) => (
                <div key={section.id} className="mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-blue-600">
                    EXPERIENCE
                  </h2>
                  <div className="mb-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {section.content.position}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {section.content.startDate} -{" "}
                        {section.content.endDate || "Present"}
                      </span>
                    </div>
                    <p className="text-gray-600">{section.content.company}</p>
                    <p className="mt-1 text-sm">
                      {section.content.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }

    if (selectedTemplate === "marco") {
      return (
        <div className={currentStyle}>
          <div className="w-2/3 p-6">
            <h1 className="text-2xl font-bold mb-1">John Doe</h1>
            <p className="text-gray-600 mb-4">Senior Software Engineer</p>

            {sections
              .filter((s) => s.type === "summary")
              .map((section) => (
                <div key={section.id} className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Summary</h2>
                  <p className="text-sm">{section.content.text}</p>
                </div>
              ))}

            {sections
              .filter((s) => s.type === "experience")
              .map((section) => (
                <div key={section.id} className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Experience</h2>
                  <div className="mb-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {section.content.position}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {section.content.startDate} -{" "}
                        {section.content.endDate || "Present"}
                      </span>
                    </div>
                    <p className="text-gray-600">{section.content.company}</p>
                    <p className="mt-1 text-sm">
                      {section.content.description}
                    </p>
                  </div>
                </div>
              ))}

            {sections
              .filter((s) => s.type === "education")
              .map((section) => (
                <div key={section.id} className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Education</h2>
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {section.content.institution}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {section.content.year}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {section.content.degree} in {section.content.field}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="w-1/3 bg-blue-50 p-6">
            <h4 className="font-semibold text-sm mb-3 text-blue-800">
              CONTACT
            </h4>
            <div className="text-xs space-y-1 mb-4 text-blue-700">
              <p>john.doe@example.com</p>
              <p>(123) 456-7890</p>
              <p>New York, NY</p>
            </div>
            <h4 className="font-semibold text-sm mb-3 text-blue-800">SKILLS</h4>
            {sections
              .filter((s) => s.type === "skills")
              .map((section) => (
                <div key={section.id} className="space-y-2">
                  {Array.isArray(section.content.list) &&
                    section.content.list.map((skill: string, index: number) => (
                      <div
                        key={index}
                        className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs text-center min-h-[20px] flex items-center justify-center"
                      >
                        {skill}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      );
    }

    if (selectedTemplate === "creative") {
      return (
        <div className={currentStyle}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-1">John Doe</h1>
            <p className="text-purple-700">Senior Software Engineer</p>
            <div className="text-sm text-purple-600 space-x-2 mt-2">
              <span>john.doe@example.com</span>
              <span>•</span>
              <span>(123) 456-7890</span>
              <span>•</span>
              <span>New York, NY</span>
            </div>
          </div>

          <div className="space-y-4">
            {sections
              .filter((s) => s.type === "summary")
              .map((section) => (
                <div key={section.id} className="bg-white/70 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2 text-purple-800">
                    Summary
                  </h2>
                  <p className="text-sm">{section.content.text}</p>
                </div>
              ))}

            {sections
              .filter((s) => s.type === "experience")
              .map((section) => (
                <div key={section.id} className="bg-white/70 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2 text-purple-800">
                    Experience
                  </h2>
                  <div className="mb-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {section.content.position}
                      </h3>
                      <span className="text-sm text-purple-600">
                        {section.content.startDate} -{" "}
                        {section.content.endDate || "Present"}
                      </span>
                    </div>
                    <p className="text-purple-700">{section.content.company}</p>
                    <p className="mt-1 text-sm">
                      {section.content.description}
                    </p>
                  </div>
                </div>
              ))}

            <div className="grid grid-cols-2 gap-4">
              {sections
                .filter((s) => s.type === "education")
                .map((section) => (
                  <div key={section.id} className="bg-white/70 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2 text-purple-800">
                      Education
                    </h2>
                    <div>
                      <h3 className="font-medium">
                        {section.content.institution}
                      </h3>
                      <p className="text-purple-700">
                        {section.content.degree}
                      </p>
                      <p className="text-sm text-purple-600">
                        {section.content.year}
                      </p>
                    </div>
                  </div>
                ))}

              {sections
                .filter((s) => s.type === "skills")
                .map((section) => (
                  <div key={section.id} className="bg-white/70 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2 text-purple-800">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(section.content.list) &&
                        section.content.list.map(
                          (skill: string, index: number) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded text-xs flex items-center justify-center"
                            >
                              {skill}
                            </span>
                          ),
                        )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
    }

    // Default Harvard/Simple/Executive template
    return (
      <div className={currentStyle}>
        <div
          className={
            selectedTemplate === "executive"
              ? "border-b-2 border-gray-800 pb-4 mb-6"
              : "mb-4"
          }
        >
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-gray-600">Senior Software Engineer</p>
          <div className="flex text-sm text-gray-600 space-x-4 mt-1">
            <span>john.doe@example.com</span>
            <span>(123) 456-7890</span>
            <span>New York, NY</span>
          </div>
        </div>

        {selectedTemplate !== "executive" && <Separator className="my-4" />}

        <div className="space-y-4">
          {sections.map((section) => {
            const titleClass =
              selectedTemplate === "executive"
                ? "text-lg font-semibold mb-2 uppercase tracking-wide"
                : "text-lg font-semibold mb-2";

            switch (section.type) {
              case "summary":
                return (
                  <div key={section.id}>
                    <h2 className={titleClass}>
                      {selectedTemplate === "executive"
                        ? "Professional Summary"
                        : "Summary"}
                    </h2>
                    <p className="text-sm">{section.content.text}</p>
                  </div>
                );
              case "experience":
                return (
                  <div key={section.id}>
                    <h2 className={titleClass}>Experience</h2>
                    <div className="mb-2">
                      <div className="flex justify-between">
                        <h3 className="font-medium">
                          {section.content.position}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {section.content.startDate} -{" "}
                          {section.content.endDate || "Present"}
                        </span>
                      </div>
                      <p className="text-gray-600">{section.content.company}</p>
                      <p className="mt-1 text-sm">
                        {section.content.description}
                      </p>
                    </div>
                  </div>
                );
              case "education":
                return (
                  <div key={section.id}>
                    <h2 className={titleClass}>Education</h2>
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-medium">
                          {section.content.institution}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {section.content.year}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {section.content.degree} in {section.content.field}
                      </p>
                    </div>
                  </div>
                );
              case "skills":
                return (
                  <div key={section.id}>
                    <h2 className={titleClass}>
                      {selectedTemplate === "executive"
                        ? "Core Skills"
                        : "Skills"}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(section.content.list) &&
                        section.content.list.map(
                          (skill: string, index: number) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs flex items-center justify-center"
                            >
                              {skill}
                            </span>
                          ),
                        )}
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  const renderSectionEditor = (section: ResumeSection) => {
    switch (section.type) {
      case "summary":
        return (
          <div className="space-y-4">
            <Label htmlFor={`summary-${section.id}`}>
              Professional Summary
            </Label>
            <Textarea
              id={`summary-${section.id}`}
              value={section.content.text}
              onChange={(e) =>
                updateSection(section.id, { text: e.target.value })
              }
              placeholder="Write a compelling professional summary..."
              className="min-h-[120px]"
            />
          </div>
        );
      case "experience":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`company-${section.id}`}>Company</Label>
                <Input
                  id={`company-${section.id}`}
                  value={section.content.company}
                  onChange={(e) =>
                    updateSection(section.id, {
                      ...section.content,
                      company: e.target.value,
                    })
                  }
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor={`position-${section.id}`}>Position</Label>
                <Input
                  id={`position-${section.id}`}
                  value={section.content.position}
                  onChange={(e) =>
                    updateSection(section.id, {
                      ...section.content,
                      position: e.target.value,
                    })
                  }
                  placeholder="Job title"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-${section.id}`}>Start Date</Label>
                <Input
                  id={`startDate-${section.id}`}
                  type="month"
                  value={section.content.startDate}
                  onChange={(e) =>
                    updateSection(section.id, {
                      ...section.content,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${section.id}`}>End Date</Label>
                <Input
                  id={`endDate-${section.id}`}
                  type="month"
                  value={section.content.endDate}
                  onChange={(e) =>
                    updateSection(section.id, {
                      ...section.content,
                      endDate: e.target.value,
                    })
                  }
                  placeholder="Present"
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`description-${section.id}`}>Description</Label>
              <Textarea
                id={`description-${section.id}`}
                value={section.content.description}
                onChange={(e) =>
                  updateSection(section.id, {
                    ...section.content,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your responsibilities and achievements..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        );
      case "education":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor={`institution-${section.id}`}>Institution</Label>
              <Input
                id={`institution-${section.id}`}
                value={section.content.institution}
                onChange={(e) =>
                  updateSection(section.id, {
                    ...section.content,
                    institution: e.target.value,
                  })
                }
                placeholder="University or school name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`degree-${section.id}`}>Degree</Label>
                <Input
                  id={`degree-${section.id}`}
                  value={section.content.degree}
                  onChange={(e) =>
                    updateSection(section.id, {
                      ...section.content,
                      degree: e.target.value,
                    })
                  }
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
              <div>
                <Label htmlFor={`field-${section.id}`}>Field of Study</Label>
                <Input
                  id={`field-${section.id}`}
                  value={section.content.field}
                  onChange={(e) =>
                    updateSection(section.id, {
                      ...section.content,
                      field: e.target.value,
                    })
                  }
                  placeholder="Major or concentration"
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`year-${section.id}`}>Graduation Year</Label>
              <Input
                id={`year-${section.id}`}
                value={section.content.year}
                onChange={(e) =>
                  updateSection(section.id, {
                    ...section.content,
                    year: e.target.value,
                  })
                }
                placeholder="Year of graduation"
              />
            </div>
          </div>
        );
      case "skills":
        return (
          <div className="space-y-4">
            <Label htmlFor={`skills-${section.id}`}>
              Skills (comma separated)
            </Label>
            <Textarea
              id={`skills-${section.id}`}
              value={
                Array.isArray(section.content.list)
                  ? section.content.list.join(", ")
                  : ""
              }
              onChange={(e) => {
                const skillsList = e.target.value
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean);
                updateSection(section.id, { list: skillsList });
              }}
              placeholder="JavaScript, React, Project Management, etc."
              className="min-h-[80px]"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(section.content.list) &&
                section.content.list.map((skill: string, index: number) => (
                  <div
                    key={index}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </div>
                ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-foreground p-6 h-full">
      <div className="flex flex-col h-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Resume Builder</h1>
            <p className="text-muted-foreground">
              Create an ATS-optimized resume
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button size="sm" onClick={downloadPDF} disabled={isDownloading}>
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "Generating PDF..." : "Download PDF"}
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="templates">Choose Template</TabsTrigger>
            <TabsTrigger value="editor">Edit Content</TabsTrigger>
            <TabsTrigger value="preview">Preview & Optimize</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="flex-1 overflow-hidden">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Choose a template</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our Resume templates are designed with one goal in mind: to help
                job seekers successfully pass Applicant Tracking Systems (ATS)
                screening and get in front of hiring managers. These templates
                are proven to maximise your chances of landing an interview.
              </p>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full max-w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {templates.map((template) => (
                  <CarouselItem
                    key={template.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-lg relative ${selectedTemplate === template.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      {template.recommended && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Recommended
                          </div>
                        </div>
                      )}
                      <div className="aspect-[8.5/11] overflow-hidden rounded-t-lg bg-white">
                        <div className="w-full h-full flex items-center justify-center p-4">
                          {template.id === "harvard" && (
                            <div className="w-full h-full bg-white border border-gray-200 p-4 text-xs">
                              <div className="text-center mb-3">
                                <h3 className="font-bold text-lg">
                                  Ellen Musk
                                </h3>
                                <p className="text-gray-600">
                                  Software Engineering Manager
                                </p>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    SUMMARY
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    Experienced software engineering manager...
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    EXPERIENCE
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    Senior Software Engineer • Google
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    EDUCATION
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    Bachelor of Science in Computer Science
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    SKILLS
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    JavaScript, React, Node.js
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {template.id === "modern" && (
                            <div className="w-full h-full bg-slate-700 text-white p-4 text-xs flex">
                              <div className="w-1/3 pr-2">
                                <div className="w-16 h-16 bg-blue-500 rounded-full mb-2 mx-auto"></div>
                                <h4 className="font-semibold text-xs mb-1">
                                  CONTACT
                                </h4>
                                <h4 className="font-semibold text-xs mb-1">
                                  EDUCATION
                                </h4>
                                <h4 className="font-semibold text-xs mb-1">
                                  SKILLS
                                </h4>
                              </div>
                              <div className="w-2/3 pl-2">
                                <h3 className="font-bold text-sm mb-1">
                                  GARY PRENTIS
                                </h3>
                                <p className="text-xs mb-2">
                                  Software Engineer
                                </p>
                                <h4 className="font-semibold text-xs mb-1">
                                  SUMMARY
                                </h4>
                                <p className="text-xs mb-2">
                                  Experienced professional...
                                </p>
                                <h4 className="font-semibold text-xs mb-1">
                                  EXPERIENCE
                                </h4>
                                <p className="text-xs">
                                  Senior Developer • Tech Corp
                                </p>
                              </div>
                            </div>
                          )}
                          {template.id === "simple" && (
                            <div className="w-full h-full bg-white border border-gray-200 p-4 text-xs">
                              <div className="text-center mb-3 border-b pb-2">
                                <h3 className="font-bold text-lg">John Doe</h3>
                                <p className="text-gray-600">
                                  Professional Summary
                                </p>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    Work Experience
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    Software Engineer
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    Education
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    Bachelor of Science
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    Skills
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    Technical Skills
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {template.id === "marco" && (
                            <div className="w-full h-full bg-white border border-gray-200 p-4 text-xs flex">
                              <div className="w-2/3 pr-2">
                                <h3 className="font-bold text-lg mb-1">
                                  Marco
                                </h3>
                                <p className="text-gray-600 mb-2">
                                  Software Engineer
                                </p>
                                <h4 className="font-semibold text-sm mb-1">
                                  Summary
                                </h4>
                                <p className="text-xs mb-2">
                                  Experienced software engineer...
                                </p>
                                <h4 className="font-semibold text-sm mb-1">
                                  Experience
                                </h4>
                                <p className="text-xs mb-1">Senior Engineer</p>
                                <h4 className="font-semibold text-sm mb-1">
                                  Education
                                </h4>
                                <p className="text-xs">
                                  Computer Science Degree
                                </p>
                              </div>
                              <div className="w-1/3 bg-blue-50 p-2">
                                <h4 className="font-semibold text-xs mb-1 text-blue-800">
                                  CONTACT
                                </h4>
                                <h4 className="font-semibold text-xs mb-1 text-blue-800">
                                  SKILLS
                                </h4>
                                <div className="space-y-1">
                                  <div className="bg-blue-200 text-blue-800 px-1 py-0.5 rounded text-xs">
                                    React
                                  </div>
                                  <div className="bg-blue-200 text-blue-800 px-1 py-0.5 rounded text-xs">
                                    Node.js
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {template.id === "executive" && (
                            <div className="w-full h-full bg-white border border-gray-200 p-4 text-xs">
                              <div className="border-b-2 border-gray-800 pb-2 mb-3">
                                <h3 className="font-bold text-lg">
                                  Adam Johnson
                                </h3>
                                <p className="text-gray-600">
                                  Executive Manager
                                </p>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                                    Professional Summary
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    Senior executive with proven track record...
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                                    Experience
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    VP of Engineering • Fortune 500
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                                    Education
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    MBA, Harvard Business School
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                                    Core Skills
                                  </h4>
                                  <p className="text-xs text-gray-700">
                                    Leadership, Strategy, Operations
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {template.id === "creative" && (
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 p-4 text-xs">
                              <div className="text-center mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-2"></div>
                                <h3 className="font-bold text-lg">John Doe</h3>
                                <p className="text-purple-700">
                                  Creative Director
                                </p>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-white/50 p-2 rounded">
                                  <h4 className="font-semibold text-sm text-purple-800">
                                    Summary
                                  </h4>
                                  <p className="text-xs">
                                    Creative professional with innovative
                                    approach...
                                  </p>
                                </div>
                                <div className="bg-white/50 p-2 rounded">
                                  <h4 className="font-semibold text-sm text-purple-800">
                                    Experience
                                  </h4>
                                  <p className="text-xs">
                                    Art Director • Design Studio
                                  </p>
                                </div>
                                <div className="bg-white/50 p-2 rounded">
                                  <h4 className="font-semibold text-sm text-purple-800">
                                    Education
                                  </h4>
                                  <p className="text-xs">
                                    BFA in Graphic Design
                                  </p>
                                </div>
                                <div className="bg-white/50 p-2 rounded">
                                  <h4 className="font-semibold text-sm text-purple-800">
                                    Skills
                                  </h4>
                                  <p className="text-xs">
                                    Adobe Creative Suite, UI/UX
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-semibold text-lg mb-1">
                            {template.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                        <div className="flex justify-center mt-3">
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="opacity-0 hover:opacity-100 transition-opacity duration-200" />
              <CarouselNext className="opacity-0 hover:opacity-100 transition-opacity duration-200" />
            </Carousel>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setActiveTab("editor")} size="lg">
                Continue to Editor <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="flex-1 overflow-hidden flex">
            <div className="w-2/3 pr-6 overflow-hidden flex flex-col">
              <Card className="flex-1 overflow-hidden">
                <CardHeader>
                  <CardTitle>Resume Sections</CardTitle>
                  <CardDescription>
                    Drag and drop sections to reorder
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="p-6 space-y-6">
                      {sections.map((section) => (
                        <Card key={section.id} className="relative">
                          <div className="absolute left-3 top-3 cursor-move p-1 rounded hover:bg-muted">
                            <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <CardHeader className="pl-12">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg capitalize">
                                {section.type}
                              </CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSection(section.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {renderSectionEditor(section)}
                          </CardContent>
                        </Card>
                      ))}

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => addSection("summary")}
                          className="flex items-center"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Summary
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => addSection("experience")}
                          className="flex items-center"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => addSection("education")}
                          className="flex items-center"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => addSection("skills")}
                          className="flex items-center"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Skills
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="w-1/3 overflow-hidden flex flex-col">
              <Card className="flex-1 overflow-hidden">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="(123) 456-7890" />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, State" />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                      <Input
                        id="linkedin"
                        placeholder="linkedin.com/in/johndoe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">Github (optional)</Label>
                      <Input id="github" placeholder="github.com/johndoe" />
                    </div>

                    {(selectedTemplate === "modern" ||
                      selectedTemplate === "creative") && (
                      <div>
                        <Label htmlFor="profileImage">Profile Picture</Label>
                        <div className="space-y-3">
                          {profileImage ? (
                            <div className="flex items-center space-x-3">
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                                <img
                                  src={profileImage}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-2">
                                  Profile picture uploaded successfully
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={removeProfileImage}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                id="profileImage"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Profile Picture
                              </Button>
                              <p className="text-xs text-muted-foreground mt-1">
                                Supports JPEG, PNG, WebP. Max 5MB. Image will be
                                cropped to square.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-hidden flex">
            <div className="w-2/3 pr-6 overflow-hidden flex flex-col">
              <Card className="flex-1 overflow-hidden">
                <CardHeader>
                  <CardTitle>Resume Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    ref={resumePreviewRef}
                    className="bg-white aspect-[8.5/11] mx-auto shadow-lg border rounded-md overflow-hidden"
                  >
                    {renderResumePreview()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-1/3 overflow-hidden flex flex-col">
              <Card className="flex-1 overflow-hidden">
                <CardHeader>
                  <CardTitle>ATS Optimization</CardTitle>
                  <CardDescription>
                    {showAtsScore
                      ? "Live ATS analysis of your optimized resume"
                      : "How your resume performs against ATS systems"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>ATS Score</Label>
                        <span
                          className={`font-medium ${atsScore >= 80 ? "text-green-500" : atsScore >= 60 ? "text-amber-500" : "text-red-500"}`}
                        >
                          {atsScore}%
                        </span>
                      </div>
                      <Progress value={atsScore} className="h-2" />
                      {showAtsScore && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Score updates as you edit your resume
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Keyword Analysis</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-500">✓ JavaScript</span>
                          <span>Found in Skills</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-500">✓ React</span>
                          <span>Found in Skills, Experience</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-red-500">✗ Docker</span>
                          <span>Missing</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-amber-500">
                            ⚠ Project Management
                          </span>
                          <span>Mentioned once</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Suggestions</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">⚠</span>
                          <span>
                            Add more specific achievements with measurable
                            results
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">⚠</span>
                          <span>
                            Include relevant technical skills like Docker and
                            Kubernetes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>
                            Good job using action verbs in your experience
                            descriptions
                          </span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      onClick={downloadPDF}
                      disabled={isDownloading}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isDownloading
                        ? "Generating PDF..."
                        : "Download ATS-Optimized PDF"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeBuilder;
