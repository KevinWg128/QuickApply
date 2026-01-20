
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import { ResumeData } from './profile.service.js';

const MODEL_NAME = 'gemini-2.5-flash'; // Or 'gemini-1.5-pro'

// Helper function to get MIME type from file extension
function getMimeTypeFromExtension(filename: string): string | null {
    const ext = path.extname(filename).toLowerCase();
    const mimeMap: Record<string, string> = {
        '.pdf': 'application/pdf',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.doc': 'application/msword',
        '.txt': 'text/plain',
        '.md': 'text/markdown',
        '.rtf': 'application/rtf',
    };
    return mimeMap[ext] || null;
}

// Helper function to get file extension from MIME type
function getExtensionFromMimeType(mimeType: string): string {
    const extMap: Record<string, string> = {
        'application/pdf': '.pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/msword': '.doc',
        'text/plain': '.txt',
        'text/markdown': '.md',
        'application/rtf': '.rtf',
    };
    return extMap[mimeType] || '.bin';
}

export async function parseResume(filePath: string, mimeType: string, apiKey: string, originalFilename?: string): Promise<ResumeData> {
    const client = new GoogleGenAI({ apiKey });

    // Determine the correct MIME type
    let resolvedMimeType = mimeType;

    // If MIME type is application/octet-stream (generic), try to detect from file extension
    if (mimeType === 'application/octet-stream' && originalFilename) {
        const detectedMime = getMimeTypeFromExtension(originalFilename);
        if (detectedMime) {
            resolvedMimeType = detectedMime;
            console.log(`Detected MIME type from filename: ${resolvedMimeType}`);
        }
    }

    // Validate that we have a supported MIME type
    const supportedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'text/markdown',
        'application/rtf',
    ];

    if (!supportedMimeTypes.includes(resolvedMimeType)) {
        throw new Error(`Unsupported file type: ${resolvedMimeType}. Supported types are: PDF, DOCX, DOC, TXT, MD, RTF`);
    }

    // Rename file to have correct extension (Gemini relies on extension for MIME type detection)
    const ext = getExtensionFromMimeType(resolvedMimeType);
    const newPath = filePath + ext;
    fs.renameSync(filePath, newPath);

    try {
        // 1. Upload file with explicit MIME type
        console.log(`Uploading file to Gemini: ${newPath} (MIME: ${resolvedMimeType})`);
        const uploadResult = await client.files.upload({
            file: newPath,
            config: { mimeType: resolvedMimeType }
        });
        console.log(`File uploaded: ${uploadResult.uri}`);

        // 2. Generate content
        const prompt = `
      You are a resume parser. Extract the following information from the provided resume file and return it in JSON format exactly matching the schema below.
      Do not include markdown code blocks, just the raw JSON.
      
      Schema:
      {
        "personalInfo": {
          "name": "string",
          "email": "string",
          "phone": "string",
          "linkedinUrl": "string (optional)",
          "personalSiteUrl": "string (optional)",
          "summary": "string (optional)"
        },
        "workExperience": [
          {
            "company": "string",
            "title": "string",
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD (or null if current)",
            "isCurrent": boolean,
            "location": "string",
            "description": "string"
          }
        ],
        "education": [
          {
            "institution": "string",
            "degree": "string",
            "fieldOfStudy": "string",
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD",
            "gpa": number (optional),
            "description": "string"
          }
        ],
        "skills": [
          {
            "name": "string",
            "category": "string (optional)",
            "proficiency": "string (optional)"
          }
        ],
        "projects": [
            {
                "name": "string",
                "description": "string",
                "url": "string (optional)",
                "startDate": "YYYY-MM-DD (optional)",
                "endDate": "YYYY-MM-DD (optional)",
                "type": "project"
            }
        ],
        "certifications": [
            {
                "name": "string",
                "issuer": "string",
                "issueDate": "YYYY-MM-DD",
                "expiryDate": "YYYY-MM-DD (optional)",
                "credentialId": "string (optional)",
                "credentialUrl": "string (optional)"
            }
        ]
      }
    `;

        console.log('Generating content...');
        const response = await client.models.generateContent({
            model: MODEL_NAME,
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        { fileData: { fileUri: uploadResult.uri, mimeType: uploadResult.mimeType } },
                    ],
                },
            ],
            config: {
                responseMimeType: 'application/json',
            }
        });

        const responseText = response.text;
        console.log('Gemini response received.');

        if (!responseText) {
            throw new Error('Empty response from Gemini');
        }

        try {
            const data = JSON.parse(responseText) as ResumeData;
            return data;
        } catch (e) {
            console.error('Failed to parse JSON:', responseText);
            throw new Error('Failed to parse Gemini response as JSON');
        }

    } catch (error) {
        console.error('Error in parseResume:', error);
        throw error;
    } finally {
        if (newPath && fs.existsSync(newPath)) {
            try {
                fs.unlinkSync(newPath);
            } catch (e) {
                console.error("Failed to cleanup resume file:", e);
            }
        }
    }
}


// Interface for job application data
interface JobApplication {
    id: string;
    jobUrl?: string | null;
    jobTitle: string;
    company: string;
    jobDescription?: string | null;
    notes?: string | null;
    status: string;
    appliedAt: string;
}

// Interface for profile data
interface Profile {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    personalSiteUrl?: string | null;
    linkedinUrl?: string | null;
    workExperiences?: Array<{
        company: string;
        title: string;
        location?: string | null;
        startDate: string;
        endDate?: string | null;
        description?: string | null;
        isCurrent: boolean;
    }>;
    educations?: Array<{
        institution: string;
        degree: string;
        fieldOfStudy?: string | null;
        startDate: string;
        endDate?: string | null;
    }>;
    skills?: Array<{
        name: string;
        category?: string | null;
    }>;
    projects?: Array<{
        name: string;
        description?: string | null;
        url?: string | null;
        startDate?: string | null;
        endDate?: string | null;
        type: string;
    }>;
    certifications?: Array<{
        name: string;
        issuer: string;
        issueDate: string;
    }>;
}

// Interface for tailored content response
export interface TailoredContent {
    summaryBullets: string[];     // 5 tailored bullet points
    keySkills: string[];          // 3 key skills for title bar
    relevantSkills: string[];     // Up to 9 relevant skills
    coverLetterBody: string;      // Generated cover letter content
}

export async function generateTailoredContent(
    jobApplication: JobApplication,
    profile: Profile,
    apiKey: string
): Promise<TailoredContent> {
    const client = new GoogleGenAI({ apiKey });

    // Build profile summary for Gemini
    const workExperienceSummary = profile.workExperiences?.map(exp =>
        `- ${exp.title} at ${exp.company}${exp.location ? ` (${exp.location})` : ''}: ${exp.description || 'No description'}`
    ).join('\n') || 'No work experience listed';

    const skillsList = profile.skills?.map(s => s.name).join(', ') || 'No skills listed';

    const projectsSummary = profile.projects?.map(p =>
        `- ${p.name}: ${p.description || 'No description'}`
    ).join('\n') || 'No projects listed';

    const prompt = `
You are a professional resume consultant. Analyze the job posting and candidate's profile to generate tailored resume content.

## Job Posting
**Title:** ${jobApplication.jobTitle}
**Company:** ${jobApplication.company}
**Description:**
${jobApplication.jobDescription || 'No job description provided'}

## Candidate Profile
**Name:** ${profile.name}

**Work Experience:**
${workExperienceSummary}

**Skills:** ${skillsList}

**Projects:**
${projectsSummary}

## Instructions
Generate the following content tailored to this specific job:

1. **summaryBullets**: Exactly 5 achievement-focused bullet points for the resume summary section. Each bullet should:
   - Start with a strong action verb
   - Include quantifiable results where possible
   - Be relevant to the job requirements
   - Highlight the candidate's most impressive achievements that align with the role

2. **keySkills**: Exactly 3 of the most important skills for this role (to display prominently under the job title)

3. **relevantSkills**: Up to 9 skills from the candidate's profile that are most relevant to this job posting

4. **coverLetterBody**: A professional cover letter body (3-4 paragraphs) that:
   - Opens with enthusiasm for the specific role and company
   - Highlights 2-3 key achievements relevant to this role
   - Explains why the candidate is a great fit
   - Closes with a call to action

Return ONLY valid JSON matching this schema (no markdown, no code blocks):
{
  "summaryBullets": ["string", "string", "string", "string", "string"],
  "keySkills": ["string", "string", "string"],
  "relevantSkills": ["string", ...],
  "coverLetterBody": "string"
}
`;

    console.log('Generating tailored content with Gemini...');

    const response = await client.models.generateContent({
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json',
        }
    });

    const responseText = response.text;
    console.log('Gemini response received.');

    if (!responseText) {
        throw new Error('Empty response from Gemini');
    }

    try {
        const data = JSON.parse(responseText) as TailoredContent;

        // Validate the response structure
        if (!Array.isArray(data.summaryBullets) || data.summaryBullets.length !== 5) {
            throw new Error('Invalid summaryBullets: expected exactly 5 items');
        }
        if (!Array.isArray(data.keySkills) || data.keySkills.length !== 3) {
            throw new Error('Invalid keySkills: expected exactly 3 items');
        }
        if (!Array.isArray(data.relevantSkills) || data.relevantSkills.length === 0) {
            throw new Error('Invalid relevantSkills: expected at least 1 item');
        }
        if (typeof data.coverLetterBody !== 'string' || !data.coverLetterBody) {
            throw new Error('Invalid coverLetterBody: expected non-empty string');
        }

        return data;
    } catch (e) {
        console.error('Failed to parse JSON:', responseText);
        throw new Error('Failed to parse Gemini response as JSON');
    }
}
