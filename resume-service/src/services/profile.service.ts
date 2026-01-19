import axios from 'axios';

const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://localhost:3001';

export interface ResumeData {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
        linkedinUrl?: string;
        personalSiteUrl?: string;
        summary?: string;
    };
    workExperience: Array<{
        company: string;
        title: string;
        startDate: string;
        endDate?: string;
        isCurrent?: boolean;
        location?: string;
        description?: string;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        startDate: string;
        endDate?: string;
        gpa?: number;
        description?: string;
    }>;
    skills: Array<{
        name: string;
        category?: string;
        proficiency?: string;
    }>;
    projects: Array<{
        name: string;
        description?: string;
        url?: string;
        startDate?: string;
        endDate?: string;
        type?: string;
    }>;
    certifications: Array<{
        name: string;
        issuer: string;
        issueDate: string;
        expiryDate?: string;
        credentialId?: string;
        credentialUrl?: string;
    }>;
}

export async function getProfile() {
    try {
        const response = await axios.get(`${PROFILE_SERVICE_URL}/profile`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        // If 404, return null? Or let it throw?
        // If it throws, the route handler sees it.
        throw new Error('Failed to fetch profile');
    }
}

export async function updateProfileWithResumeData(data: ResumeData) {
    try {
        // 1. Update basic info
        console.log('Updating profile basic info...');
        await axios.put(`${PROFILE_SERVICE_URL}/profile`, {
            name: data.personalInfo.name,
            email: data.personalInfo.email,
            phone: data.personalInfo.phone,
            linkedinUrl: data.personalInfo.linkedinUrl,
            personalSiteUrl: data.personalInfo.personalSiteUrl,
        });

        // 2. Add Work Experiences
        // Note: This appends. Ideally we might want to clear existing or deduplicate.
        if (data.workExperience && data.workExperience.length > 0) {
            console.log(`Adding ${data.workExperience.length} work experiences...`);
            for (const exp of data.workExperience) {
                await axios.post(`${PROFILE_SERVICE_URL}/experiences`, exp);
            }
        }

        // 3. Add Education
        if (data.education && data.education.length > 0) {
            console.log(`Adding ${data.education.length} education entries...`);
            for (const edu of data.education) {
                await axios.post(`${PROFILE_SERVICE_URL}/education`, edu);
            }
        }

        // 4. Add Skills
        if (data.skills && data.skills.length > 0) {
            console.log(`Adding ${data.skills.length} skills...`);
            for (const skill of data.skills) {
                await axios.post(`${PROFILE_SERVICE_URL}/skills`, skill);
            }
        }

        // 5. Add Projects
        if (data.projects && data.projects.length > 0) {
            console.log(`Adding ${data.projects.length} projects...`);
            for (const project of data.projects) {
                await axios.post(`${PROFILE_SERVICE_URL}/projects`, project);
            }
        }

        // 6. Add Certifications
        if (data.certifications && data.certifications.length > 0) {
            console.log(`Adding ${data.certifications.length} certifications...`);
            for (const cert of data.certifications) {
                await axios.post(`${PROFILE_SERVICE_URL}/certifications`, cert);
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating profile with resume data:', error);
        throw error;
    }
}
