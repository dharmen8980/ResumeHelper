"use server";

import { Document, Paragraph, TextRun, AlignmentType, TabStopType, TabStopPosition, BorderStyle, Packer } from "docx";
import { format } from "date-fns";

// Types for resume data
interface Contact {
  address: string;
  phone: string;
  email: string;
}

interface Education {
  degree: string;
  gpa: string;
  fromDate?: Date;
  toDate?: Date;
  institution: string;
}

interface WorkExperience {
  title: string;
  fromDate?: Date;
  toDate?: Date;
  location: string;
  responsibilities: string[];
}

interface Honor {
  title: string;
  dates: string;
  institution: string;
  achievements: string[];
}

interface ResumeData {
  name: string;
  contact: Contact;
  sections: {
    EDUCATION?: Education[];
    "WORK EXPERIENCE"?: WorkExperience[];
    "HONORS AND AWARDS"?: Honor[];
    SKILLS?: string[];
  };
}

// Helper functions
const createBulletPoints = (items: string[], indent = 720) => {
  return items.map(
    (text, index) =>
      new Paragraph({
        children: [
          new TextRun({
            text,
            size: 22, // Font size 11
          }),
        ],
        numbering: {
          reference: "bullet-list",
          level: 0,
        },
        indent: {
          left: indent,
          hanging: 360,
        },
        spacing: { after: index === items.length - 1 ? 100 : 50 },
      })
  );
};

const createSectionHeader = (text: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        underline: true,
        bold: true,
        size: 22, // Font size 11
      }),
    ],
    spacing: { after: 50 },
  });
};

const createPositionHeader = (title: string, dates: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22, // Font size 11
      }),
      new TextRun({
        text: `\t${dates}`,
        bold: true,
        size: 22, // Font size 11
      }),
    ],
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX + 1100,
      },
    ],
    spacing: { after: 50 },
  });
};

const formatDateRange = (fromDate?: Date, toDate?: Date) => {
  const from = fromDate ? format(new Date(fromDate), "MMM yyyy") : "";
  const to = toDate ? format(new Date(toDate), "MMM yyyy") : "Present";
  return `${from} - ${to}`;
};

export async function generateResume(resumeData: ResumeData): Promise<Uint8Array> {
  const numbering = {
    config: [
      {
        reference: "bullet-list",
        levels: [
          {
            level: 0,
            format: "bullet",
            text: "•",
            alignment: "left",
            style: {
              font: "Arial",
            },
            size: 22, // Font size 11
          },
        ],
      },
    ],
  };

  const children = [
    // Header
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.name,
          bold: true,
          size: 40, // Larger font for the name
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
    }),

    // Contact Info
    new Paragraph({
      children: [
        new TextRun({ text: resumeData.contact.address, size: 22 }),
        new TextRun({ text: ` | ${resumeData.contact.phone}`, size: 22 }),
        new TextRun({ text: ` | ${resumeData.contact.email}`, size: 22 }),
        new TextRun({ text: " | GitHub/LinkedIn", size: 22 }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: "000000",
          space: 6,
        },
      },
    }),
  ];

  // Education Section
  if (resumeData.sections.EDUCATION) {
    children.push(createSectionHeader("EDUCATION"));
    resumeData.sections.EDUCATION.forEach((edu) => {
      children.push(
        createPositionHeader(`${edu.degree}, GPA – ${edu.gpa}`, formatDateRange(edu.fromDate, edu.toDate)),
        new Paragraph({
          children: [new TextRun({ text: edu.institution, italics: true, size: 22 })],
          spacing: { after: 50 },
        })
      );
    });
  }

  // Work Experience Section
  if (resumeData.sections["WORK EXPERIENCE"]) {
    children.push(createSectionHeader("WORK EXPERIENCE"));
    resumeData.sections["WORK EXPERIENCE"].forEach((work) => {
      children.push(
        createPositionHeader(work.title, formatDateRange(work.fromDate, work.toDate)),
        new Paragraph({
          children: [new TextRun({ text: work.location, italics: true, size: 22 })],
          spacing: { after: 50 },
        }),
        ...createBulletPoints(work.responsibilities)
      );
    });
  }

  // Honors and Awards Section
  if (
    resumeData.sections["HONORS AND AWARDS"]?.some(
      (honor) => honor.title || honor.dates || honor.institution || honor.achievements.some((a) => a)
    )
  ) {
    children.push(createSectionHeader("HONORS AND AWARDS"));
    resumeData.sections["HONORS AND AWARDS"].forEach((honor) => {
      if (honor.title || honor.dates || honor.institution || honor.achievements.some((a) => a)) {
        children.push(
          createPositionHeader(honor.title, honor.dates),
          new Paragraph({
            children: [new TextRun({ text: honor.institution, italics: true, size: 22 })],
            spacing: { after: 50 },
          }),
          ...createBulletPoints(honor.achievements.filter((a) => a))
        );
      }
    });
  }

  // Skills Section
  if (resumeData.sections.SKILLS) {
    children.push(
      createSectionHeader("SKILLS"),
      new Paragraph({
        children: [
          new TextRun({
            text: resumeData.sections.SKILLS.join(", "),
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      })
    );
  }

  const doc = new Document({
    numbering,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  try {
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw new Error("Failed to generate resume document");
  }
}
