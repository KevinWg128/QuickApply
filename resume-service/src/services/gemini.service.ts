
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
// @ts-ignore
import { ResumeData } from './profile.service.js';

const MODEL_NAME = 'gemini-1.5-flash'; // Or 'gemini-1.5-pro'

export async function parseResume(filePath: string, mimeType: string, apiKey: string): Promise<ResumeData> {
    const client = new GoogleGenAI({ apiKey });

    // 0. Rename file to have extension (Gemini relies on extension for Mime type if not provided)
    const extension = mimeType.split('/')[1]; // very rough, but works for pdf/json/etc.
    // Better mapping:
    let ext = '.bin';
    if (mimeType === 'application/pdf') ext = '.pdf';
    else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ext = '.docx';
    else if (mimeType === 'text/plain') ext = '.txt';
    else if (mimeType === 'text/markdown') ext = '.md';

    const newPath = filePath + ext;
    fs.renameSync(filePath, newPath);

    try {
        // 1. Upload file
        console.log(`Uploading file to Gemini: ${newPath}`);
        const uploadResult = await client.files.upload({ file: newPath });
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

