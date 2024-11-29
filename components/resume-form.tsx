"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DatePicker } from "./date-picker";

interface FormData {
  name: string;
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  sections: {
    EDUCATION: Array<{
      degree: string;
      gpa: string;
      fromDate?: Date;
      toDate?: Date;
      institution: string;
    }>;
    "WORK EXPERIENCE": Array<{
      title: string;
      fromDate?: Date;
      toDate?: Date;
      location: string;
      responsibilities: string[];
    }>;
    "HONORS AND AWARDS": Array<{
      title: string;
      dates: string;
      institution: string;
      achievements: string[];
    }>;
    SKILLS: string[];
  };
}

export default function ResumeForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contact: {
      address: "",
      phone: "",
      email: "",
    },
    sections: {
      EDUCATION: [{ degree: "", gpa: "", fromDate: undefined, toDate: undefined, institution: "" }],
      "WORK EXPERIENCE": [{ title: "", fromDate: undefined, toDate: undefined, location: "", responsibilities: [""] }],
      "HONORS AND AWARDS": [],
      SKILLS: [""],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate resume");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Resume.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating resume:", error);
      alert("Failed to generate resume");
    }
  };

  const addListItem = (section: keyof FormData["sections"], index: number, subField?: string) => {
    setFormData((prev) => {
      // Create a deep copy of the previous state to ensure immutability
      const newData = JSON.parse(JSON.stringify(prev));

      if (subField) {
        // Add to a sublist (e.g., responsibilities or achievements)
        const sublist = (newData.sections[section][index] as any)[subField];
        if (Array.isArray(sublist)) {
          sublist.push(""); // Add a single empty item to the sublist
        }
      } else if (section === "SKILLS") {
        // Add a single empty skill
        newData.sections.SKILLS.push("");
      } else {
        // Add a single empty item to the main list
        const emptyItem =
          section === "EDUCATION"
            ? { degree: "", gpa: "", fromDate: undefined, toDate: undefined, institution: "" }
            : section === "WORK EXPERIENCE"
            ? { title: "", fromDate: undefined, toDate: undefined, location: "", responsibilities: [""] }
            : { title: "", dates: "", institution: "", achievements: [""] };
        newData.sections[section].push(emptyItem);
      }

      return newData;
    });
  };

  const removeListItem = (section: keyof FormData["sections"], index: number, subIndex?: number, subField?: string) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (subField !== undefined && subIndex !== undefined) {
        const items = (newData.sections[section][index] as any)[subField];
        if (items.length > 1) {
          items.splice(subIndex, 1);
        }
      } else {
        const items = newData.sections[section];
        if (items.length > 0) {
          items.splice(index, 1);
        }
      }
      return newData;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Personal Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.contact.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, address: e.target.value },
                    }))
                  }
                  required
                  placeholder="City, State"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value },
                    }))
                  }
                  required
                  placeholder="XXX-XXX-XXXX"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value },
                    }))
                  }
                  required
                  placeholder="abc@example.com"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        {/* Education Section */}
        <AccordionItem value="education">
          <AccordionTrigger>Education</AccordionTrigger>
          <AccordionContent>
            {formData.sections.EDUCATION.map((edu, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const newData = { ...prev };
                            newData.sections.EDUCATION[index].degree = e.target.value;
                            return newData;
                          })
                        }
                        required
                        placeholder="e.g. Bachelor of Science Computer Science"
                      />
                    </div>
                    <div>
                      <Label>GPA</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const newData = { ...prev };
                            newData.sections.EDUCATION[index].gpa = e.target.value;
                            return newData;
                          })
                        }
                        placeholder="e.g. 4.0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Dates</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">From</Label>
                        <DatePicker
                          date={edu.fromDate}
                          onSelect={(date) =>
                            setFormData((prev) => {
                              const newData = { ...prev };
                              newData.sections.EDUCATION[index].fromDate = date;
                              return newData;
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">To</Label>
                        <DatePicker
                          date={edu.toDate}
                          onSelect={(date) =>
                            setFormData((prev) => {
                              const newData = { ...prev };
                              newData.sections.EDUCATION[index].toDate = date;
                              return newData;
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const newData = { ...prev };
                          newData.sections.EDUCATION[index].institution = e.target.value;
                          return newData;
                        })
                      }
                      required
                      placeholder="e.g. University of Louisiana at Monroe"
                    />
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeListItem("EDUCATION", index)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Education
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={() => addListItem("EDUCATION", 0)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience Section */}
        <AccordionItem value="experience">
          <AccordionTrigger>Work Experience</AccordionTrigger>
          <AccordionContent>
            {formData.sections["WORK EXPERIENCE"].map((exp, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title, and Company Name</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const newData = { ...prev };
                            newData.sections["WORK EXPERIENCE"][index].title = e.target.value;
                            return newData;
                          })
                        }
                        required
                        placeholder="e.g. Software Engineer at Presidio"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const newData = { ...prev };
                            newData.sections["WORK EXPERIENCE"][index].location = e.target.value;
                            return newData;
                          })
                        }
                        required
                        placeholder="City, State, Country"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Dates</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">From</Label>
                        <DatePicker
                          date={exp.fromDate}
                          onSelect={(date) =>
                            setFormData((prev) => {
                              const newData = { ...prev };
                              newData.sections["WORK EXPERIENCE"][index].fromDate = date;
                              return newData;
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">To</Label>
                        <DatePicker
                          date={exp.toDate}
                          onSelect={(date) =>
                            setFormData((prev) => {
                              const newData = { ...prev };
                              newData.sections["WORK EXPERIENCE"][index].toDate = date;
                              return newData;
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Responsibilities</Label>
                    {exp.responsibilities.map((resp, respIndex) => (
                      <div key={respIndex} className="flex gap-2 mt-2">
                        <Input
                          value={resp}
                          onChange={(e) =>
                            setFormData((prev) => {
                              const newData = { ...prev };
                              newData.sections["WORK EXPERIENCE"][index].responsibilities[respIndex] = e.target.value;
                              return newData;
                            })
                          }
                          required
                          placeholder="Enter one sentence per list. Use 'add responsibility' to add another one"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeListItem("WORK EXPERIENCE", index, respIndex, "responsibilities")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => addListItem("WORK EXPERIENCE", index, "responsibilities")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Responsibility
                    </Button>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeListItem("WORK EXPERIENCE", index)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Experience
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={() => addListItem("WORK EXPERIENCE", 0)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Honors and Awards Section */}
        <AccordionItem value="honors">
          <AccordionTrigger>Honors and Awards (Optional)</AccordionTrigger>
          <AccordionContent>
            {formData.sections["HONORS AND AWARDS"].length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <p>No honors or awards added yet.</p>
                </CardContent>
              </Card>
            ) : (
              formData.sections["HONORS AND AWARDS"].map((honor, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title, and Organization</Label>
                        <Input
                          value={honor.title}
                          onChange={(e) =>
                            setFormData((prev) => {
                              const newData = { ...prev };
                              newData.sections["HONORS AND AWARDS"][index].title = e.target.value;
                              return newData;
                            })
                          }
                          placeholder="e.g. Vice-President"
                        />
                      </div>
                      <div>
                        <Label>Dates</Label>
                        <Input
                          value={honor.dates}
                          onChange={(e) =>
                            setFormData((prev) => {
                              const newData = { ...prev };
                              newData.sections["HONORS AND AWARDS"][index].dates = e.target.value;
                              return newData;
                            })
                          }
                          placeholder="Either single or range e.g. Jan 2019 - Aug 2019"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={honor.institution}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const newData = { ...prev };
                            newData.sections["HONORS AND AWARDS"][index].institution = e.target.value;
                            return newData;
                          })
                        }
                        placeholder="Association for Computing Machinery"
                      />
                    </div>
                    <div>
                      <Label>Achievements</Label>
                      {honor.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} className="flex gap-2 mt-2">
                          <Input
                            value={achievement}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newData = { ...prev };
                                newData.sections["HONORS AND AWARDS"][index].achievements[achievementIndex] = e.target.value;
                                return newData;
                              })
                            }
                            placeholder="e.g. Hackathon Winner at ..."
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeListItem("HONORS AND AWARDS", index, achievementIndex, "achievements")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => addListItem("HONORS AND AWARDS", index, "achievements")}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeListItem("HONORS AND AWARDS", index)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Honor/Award
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
            <Button type="button" variant="outline" onClick={() => addListItem("HONORS AND AWARDS", 0)} className="mt-4">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Honor/Award
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills Section */}
        <AccordionItem value="skills">
          <AccordionTrigger>Skills</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                {formData.sections.SKILLS.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const newData = { ...prev };
                          newData.sections.SKILLS[index] = e.target.value;
                          return newData;
                        })
                      }
                      placeholder="e.g., JavaScript, Project Management, etc."
                      required
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeListItem("SKILLS", index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addListItem("SKILLS", 0)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button type="submit" className="w-full">
        Generate Resume
      </Button>
    </form>
  );
}
