import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Filter,
  Settings,
  ChevronRight,
  AlertCircle,
  Upload,
  X,
  Trash2,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  deadline: string;
  matchPercentage: number;
  description: string;
  status?: "applied" | "pending" | "rejected" | "interview";
  logo?: string;
  skills?: string[];
  autoApplied?: boolean;
}

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "applied" | "pending" | "rejected" | "interview";
  logo?: string;
  autoApplied?: boolean;
}

const JobDashboard = () => {
  const [activeTab, setActiveTab] = useState("recommendations");
  const [salaryRange, setSalaryRange] = useState([50000]);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [autoApplyCredits, setAutoApplyCredits] = useState({
    used: 5,
    total: 12,
  });

  // Questionnaire state
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [questionnaireData, setQuestionnaireData] = useState({
    race: "",
    education: {
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
    },
    driversLicense: "",
    roles: [""],
    industry: "",
    locations: [
      {
        country: "",
        cities: [""],
        workType: "in-person",
      },
    ],
    minSalary: "",
    startDate: "",
    profilePhoto: null,
  });

  const totalSteps = 8;

  // Check if questionnaire should be shown on first visit
  useEffect(() => {
    const hasCompletedQuestionnaire = localStorage.getItem(
      "questionnaireCompleted",
    );
    if (!hasCompletedQuestionnaire) {
      setShowQuestionnaire(true);
    } else {
      setQuestionnaireCompleted(true);
    }
  }, []);

  // Mock data for job recommendations
  const recommendedJobs: Job[] = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA (Remote)",
      salary: "$120,000 - $150,000",
      posted: "2 days ago",
      deadline: "In 2 weeks",
      matchPercentage: 92,
      description:
        "We are looking for a Senior Frontend Developer with expertise in React, TypeScript, and modern web technologies to join our growing team.",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp",
      skills: [
        "React",
        "TypeScript",
        "JavaScript",
        "CSS",
        "Node.js",
        "GraphQL",
      ],
      autoApplied: true,
    },
    {
      id: "2",
      title: "Full Stack Engineer",
      company: "InnovateSoft",
      location: "New York, NY",
      salary: "$110,000 - $140,000",
      posted: "1 week ago",
      deadline: "In 3 weeks",
      matchPercentage: 87,
      description:
        "Join our team as a Full Stack Engineer working with React, Node.js, and AWS to build scalable web applications.",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=InnovateSoft",
      skills: ["React", "Node.js", "AWS", "MongoDB", "Docker"],
      autoApplied: false,
    },
    {
      id: "3",
      title: "UI/UX Developer",
      company: "DesignHub",
      location: "Austin, TX (Hybrid)",
      salary: "$90,000 - $120,000",
      posted: "3 days ago",
      deadline: "In 1 week",
      matchPercentage: 78,
      description:
        "Looking for a talented UI/UX Developer with strong design skills and frontend development experience.",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DesignHub",
      skills: ["Figma", "Adobe XD", "HTML", "CSS", "JavaScript", "Prototyping"],
      autoApplied: true,
    },
    {
      id: "4",
      title: "React Native Developer",
      company: "MobileFirst",
      location: "Remote",
      salary: "$100,000 - $130,000",
      posted: "5 days ago",
      deadline: "In 10 days",
      matchPercentage: 85,
      description:
        "We need a React Native Developer to help build cross-platform mobile applications for our clients.",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=MobileFirst",
      skills: ["React Native", "JavaScript", "iOS", "Android", "Redux"],
      autoApplied: false,
    },
    {
      id: "5",
      title: "Frontend Engineer",
      company: "WebSolutions",
      location: "Chicago, IL",
      salary: "$95,000 - $125,000",
      posted: "1 day ago",
      deadline: "In 3 weeks",
      matchPercentage: 81,
      description:
        "Frontend Engineer position available for someone with strong JavaScript skills and experience with modern frameworks.",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=WebSolutions",
      skills: ["JavaScript", "Vue.js", "Webpack", "SASS", "Git"],
      autoApplied: true,
    },
  ];

  // Mock data for applications
  const applications: Application[] = [
    {
      id: "101",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      appliedDate: "2023-06-15",
      status: "interview",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp",
      autoApplied: true,
    },
    {
      id: "102",
      jobTitle: "Full Stack Engineer",
      company: "CodeMasters",
      appliedDate: "2023-06-10",
      status: "applied",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMasters",
      autoApplied: false,
    },
    {
      id: "103",
      jobTitle: "React Developer",
      company: "WebWizards",
      appliedDate: "2023-06-05",
      status: "rejected",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=WebWizards",
      autoApplied: true,
    },
    {
      id: "104",
      jobTitle: "Frontend Architect",
      company: "DigitalDreams",
      appliedDate: "2023-06-01",
      status: "pending",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DigitalDreams",
      autoApplied: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      case "interview":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "applied":
        return "Applied";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      case "interview":
        return "Interview";
      default:
        return "Unknown";
    }
  };

  const handleQuestionnaireNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete questionnaire
      setShowQuestionnaire(false);
      setQuestionnaireCompleted(true);
      localStorage.setItem("questionnaireCompleted", "true");
    }
  };

  const handleQuestionnairePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateQuestionnaireData = (field: string, value: any) => {
    setQuestionnaireData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addRole = () => {
    setQuestionnaireData((prev) => ({
      ...prev,
      roles: [...prev.roles, ""],
    }));
  };

  const updateRole = (index: number, value: string) => {
    setQuestionnaireData((prev) => ({
      ...prev,
      roles: prev.roles.map((role, i) => (i === index ? value : role)),
    }));
  };

  const addLocation = () => {
    setQuestionnaireData((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        { country: "", cities: [""], workType: "in-person" },
      ],
    }));
  };

  const updateLocation = (index: number, field: string, value: any) => {
    setQuestionnaireData((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === index ? { ...loc, [field]: value } : loc,
      ),
    }));
  };

  const removeLocation = (index: number) => {
    if (questionnaireData.locations.length > 1) {
      setQuestionnaireData((prev) => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index),
      }));
    }
  };

  const addCityToLocation = (locationIndex: number) => {
    setQuestionnaireData((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === locationIndex ? { ...loc, cities: [...loc.cities, ""] } : loc,
      ),
    }));
  };

  const updateCity = (
    locationIndex: number,
    cityIndex: number,
    value: string,
  ) => {
    setQuestionnaireData((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === locationIndex
          ? {
              ...loc,
              cities: loc.cities.map((city, j) =>
                j === cityIndex ? value : city,
              ),
            }
          : loc,
      ),
    }));
  };

  const removeCity = (locationIndex: number, cityIndex: number) => {
    setQuestionnaireData((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === locationIndex
          ? {
              ...loc,
              cities: loc.cities.filter((_, j) => j !== cityIndex),
            }
          : loc,
      ),
    }));
  };

  const renderQuestionnaireStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                What best describes your race or ethnicity?
              </h2>
              <p className="text-muted-foreground">
                These questions help support fair hiring and legal compliance.
                Your responses stay private.
              </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="race">Select your race or ethnicity</Label>
              <Select
                value={questionnaireData.race}
                onValueChange={(value) =>
                  updateQuestionnaireData("race", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="White" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="black">
                    Black or African American
                  </SelectItem>
                  <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="native-american">
                    Native American or Alaska Native
                  </SelectItem>
                  <SelectItem value="pacific-islander">
                    Native Hawaiian or Pacific Islander
                  </SelectItem>
                  <SelectItem value="two-or-more">Two or more races</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                What's your highest degree or qualification?
              </h2>
              <p className="text-muted-foreground">
                We use this to match you with jobs that fit your education.
              </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="degree">Degree</Label>
              <Select
                value={questionnaireData.education.degree}
                onValueChange={(value) =>
                  updateQuestionnaireData("education", {
                    ...questionnaireData.education,
                    degree: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-degree">No degree</SelectItem>
                  <SelectItem value="high-school">
                    High school diploma or equivalent
                  </SelectItem>
                  <SelectItem value="associate">Associate Degree</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">
                    Doctorate (PhD or equivalent)
                  </SelectItem>
                  <SelectItem value="medical">Medical Degree (MD)</SelectItem>
                  <SelectItem value="law">Law Degree (JD or LLB)</SelectItem>
                  <SelectItem value="mba">Business Degree (MBA)</SelectItem>
                  <SelectItem value="education">
                    Education Degree (MEd or EdD)
                  </SelectItem>
                  <SelectItem value="fine-arts">
                    Fine Arts Degree (BFA or MFA)
                  </SelectItem>
                  <SelectItem value="engineering">
                    Engineering Degree (BEng or MEng)
                  </SelectItem>
                  <SelectItem value="public-health">
                    Public Health Degree (MPH)
                  </SelectItem>
                  <SelectItem value="social-work">
                    Social Work Degree (MSW)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                What's your highest degree or qualification?
              </h2>
              <p className="text-muted-foreground">
                We use this to match you with jobs that fit your education.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="institution">University/Institution name</Label>
                <Input
                  id="institution"
                  placeholder="Type your answer here..."
                  value={questionnaireData.education.institution}
                  onChange={(e) =>
                    updateQuestionnaireData("education", {
                      ...questionnaireData.education,
                      institution: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="degree-select">Degree</Label>
                <Select
                  value={questionnaireData.education.degree}
                  onValueChange={(value) =>
                    updateQuestionnaireData("education", {
                      ...questionnaireData.education,
                      degree: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-degree">No degree</SelectItem>
                    <SelectItem value="high-school">
                      High school diploma or equivalent
                    </SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">
                      Doctorate (PhD or equivalent)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="start-date">Start date</Label>
                <Input
                  id="start-date"
                  type="date"
                  placeholder="DD/MM/YYYY"
                  value={questionnaireData.education.startDate}
                  onChange={(e) =>
                    updateQuestionnaireData("education", {
                      ...questionnaireData.education,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="end-date">End date</Label>
                <Input
                  id="end-date"
                  type="date"
                  placeholder="DD/MM/YYYY"
                  value={questionnaireData.education.endDate}
                  onChange={(e) =>
                    updateQuestionnaireData("education", {
                      ...questionnaireData.education,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                Do you have a current driver's license?
              </h2>
              <p className="text-muted-foreground">
                This helps us match you to jobs that may require a driver's
                license.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant={
                    questionnaireData.driversLicense === "yes"
                      ? "default"
                      : "outline"
                  }
                  className="h-16 text-lg"
                  onClick={() =>
                    updateQuestionnaireData("driversLicense", "yes")
                  }
                >
                  Yes
                </Button>
                <Button
                  variant={
                    questionnaireData.driversLicense === "no"
                      ? "default"
                      : "outline"
                  }
                  className="h-16 text-lg"
                  onClick={() =>
                    updateQuestionnaireData("driversLicense", "no")
                  }
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                What roles are you looking for?
              </h2>
              <p className="text-muted-foreground">
                We'll use this to find jobs that match your interests.
              </p>
            </div>
            <div className="space-y-4">
              {questionnaireData.roles.map((role, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Type your answer here..."
                    value={role}
                    onChange={(e) => updateRole(index, e.target.value)}
                    className="flex-1"
                  />
                  {questionnaireData.roles.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setQuestionnaireData((prev) => ({
                          ...prev,
                          roles: prev.roles.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addRole} className="w-full">
                Add another job title
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                What's your preferred industry or field?
              </h2>
              <p className="text-muted-foreground">
                We'll use this to improve matches based on your career
                interests.
              </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="industry">Industry or field</Label>
              <Select
                value={questionnaireData.industry}
                onValueChange={(value) =>
                  updateQuestionnaireData("industry", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aerospace">Aerospace</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="aviation">Aviation</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="customer-service">
                    Customer Service
                  </SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="ecommerce">E-Commerce</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Where do you want to work?</h2>
              <p className="text-muted-foreground">
                Add one or more locations to target your job search. You can
                choose cities, countries, or remote options. Leave blank if
                you're open to jobs anywhere.
              </p>
            </div>
            <div className="space-y-4">
              {questionnaireData.locations.map((location, locationIndex) => (
                <Card key={locationIndex} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">Select country</h3>
                    {questionnaireData.locations.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLocation(locationIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Input
                      placeholder="Type to search country..."
                      value={location.country}
                      onChange={(e) =>
                        updateLocation(locationIndex, "country", e.target.value)
                      }
                    />
                    <div>
                      <Label>Select cities (Optional)</Label>
                      {location.cities.map((city, cityIndex) => (
                        <div key={cityIndex} className="flex gap-2 mt-2">
                          <Input
                            placeholder="Type to search city..."
                            value={city}
                            onChange={(e) =>
                              updateCity(
                                locationIndex,
                                cityIndex,
                                e.target.value,
                              )
                            }
                            className="flex-1"
                          />
                          {location.cities.length > 1 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                removeCity(locationIndex, cityIndex)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          location.workType === "remote" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          updateLocation(locationIndex, "workType", "remote")
                        }
                      >
                        Full remote
                      </Button>
                      <Button
                        variant={
                          location.workType === "in-person"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          updateLocation(locationIndex, "workType", "in-person")
                        }
                      >
                        In-person/hybrid
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={addLocation}
                className="w-full"
              >
                Add Another Location
              </Button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                What's the lowest salary you'd consider?
              </h2>
              <p className="text-muted-foreground">
                We use this to match you with roles that meet your pay
                expectations.
              </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="min-salary">Minimum Salary</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="min-salary"
                  type="number"
                  placeholder="75000"
                  value={questionnaireData.minSalary}
                  onChange={(e) =>
                    updateQuestionnaireData("minSalary", e.target.value)
                  }
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background w-full h-full p-6">
      {autoApplyEnabled && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-800">
                  Auto Apply is Active
                </span>
              </div>
              <span className="text-green-700 text-sm">
                Automatically applying to matching jobs based on your
                preferences
              </span>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md">
              <span className="text-sm font-medium">
                {autoApplyCredits.total - autoApplyCredits.used} credits
                remaining
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Find and apply to jobs that match your resume profile
            </p>
          </div>
          <div className="flex items-center gap-4">
            {questionnaireCompleted && (
              <Button
                variant="outline"
                onClick={() => setShowQuestionnaire(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configure Profile
              </Button>
            )}
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg">
              <div className="text-sm font-medium">Auto Apply Credits</div>
              <div className="text-lg font-bold">
                {autoApplyCredits.used}/{autoApplyCredits.total}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="recommendations"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="recommendations">Job Recommendations</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="settings">Auto-Apply Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Match Relevance</SelectItem>
                  <SelectItem value="date">Date Posted</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {recommendedJobs.length} recommended jobs
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 items-center">
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {job.logo ? (
                            <img
                              src={job.logo}
                              alt={job.company}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Briefcase className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            {job.company}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-primary hover:bg-primary">
                        {job.matchPercentage}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Posted {job.posted}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Deadline: {job.deadline}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {job.description}
                    </p>
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 5 && (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
                            +{job.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-between w-full">
                      <Button variant="outline" size="sm" className="text-sm">
                        View Details
                      </Button>
                      <Button size="sm" className="text-sm">
                        Apply Now
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Application History</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 items-center">
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {application.logo ? (
                            <img
                              src={application.logo}
                              alt={application.company}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Briefcase className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle>{application.jobTitle}</CardTitle>
                            {application.autoApplied && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Applied with AI
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            {application.company}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(application.status)}`}
                        ></div>
                        <span className="text-sm font-medium">
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Applied on{" "}
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="text-sm">
                      View Application
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Apply Configuration</CardTitle>
              <CardDescription>
                Configure your preferences for automatic job applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable Auto-Apply</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically apply to jobs that match your criteria
                  </p>
                </div>
                <Switch
                  checked={autoApplyEnabled}
                  onCheckedChange={setAutoApplyEnabled}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Job Preferences</h3>

                <div className="space-y-2">
                  <Label htmlFor="job-types">Job Types</Label>
                  <Select defaultValue="fulltime">
                    <SelectTrigger id="job-types">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locations">Preferred Locations</Label>
                  <Input
                    id="locations"
                    placeholder="Enter locations (e.g., Remote, New York, San Francisco)"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="salary-range">Minimum Salary (USD)</Label>
                    <span className="text-sm">
                      ${salaryRange[0].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    id="salary-range"
                    min={30000}
                    max={200000}
                    step={5000}
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Required Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="Enter keywords (e.g., React, TypeScript, Remote)"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="match-threshold" />
                  <Label htmlFor="match-threshold">
                    Only apply to jobs with 80%+ resume match
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Application Limits</h3>

                <div className="space-y-2">
                  <Label htmlFor="daily-limit">Daily Application Limit</Label>
                  <Select defaultValue="5">
                    <SelectTrigger id="daily-limit">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 applications</SelectItem>
                      <SelectItem value="5">5 applications</SelectItem>
                      <SelectItem value="10">10 applications</SelectItem>
                      <SelectItem value="15">15 applications</SelectItem>
                      <SelectItem value="20">20 applications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="notification" defaultChecked />
                  <Label htmlFor="notification">
                    Notify me when applications are submitted
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>

          {autoApplyEnabled && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-yellow-800">
                    Auto-Apply is Active
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700">
                  Your system will automatically apply to jobs that match your
                  criteria. You can review all applications in the "My
                  Applications" tab.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Questionnaire Dialog */}
      <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="space-y-4">
              <Progress
                value={((currentStep + 1) / totalSteps) * 100}
                className="w-full"
              />
              <DialogTitle className="sr-only">
                Profile Setup Questionnaire
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="py-6">{renderQuestionnaireStep()}</div>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              variant="ghost"
              onClick={handleQuestionnairePrev}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              onClick={handleQuestionnaireNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
            >
              {currentStep === totalSteps - 1
                ? "Complete Setup"
                : "Save & Continue"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDashboard;
