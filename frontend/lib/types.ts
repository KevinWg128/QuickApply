// Profile types
export interface Profile {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    personalSiteUrl?: string | null;
    linkedinUrl?: string | null;
    createdAt: string;
    updatedAt: string;
    workExperiences?: WorkExperience[];
    educations?: Education[];
    skills?: Skill[];
    projects?: Project[];
    certifications?: Certification[];
}

export interface ProfileInput {
    name: string;
    email: string;
    phone?: string | null;
    personalSiteUrl?: string | null;
    linkedinUrl?: string | null;
}

// Work Experience types
export interface WorkExperience {
    id: string;
    profileId: string;
    company: string;
    title: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
    isCurrent: boolean;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface WorkExperienceInput {
    company: string;
    title: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
    isCurrent?: boolean;
    orderIndex?: number;
}

// Education types
export interface Education {
    id: string;
    profileId: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string | null;
    startDate: string;
    endDate?: string | null;
    gpa?: number | null;
    description?: string | null;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface EducationInput {
    institution: string;
    degree: string;
    fieldOfStudy?: string | null;
    startDate: string;
    endDate?: string | null;
    gpa?: number | null;
    description?: string | null;
    orderIndex?: number;
}

// Skill types
export interface Skill {
    id: string;
    profileId: string;
    name: string;
    category?: string | null;
    proficiency?: string | null;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface SkillInput {
    name: string;
    category?: string | null;
    proficiency?: string | null;
    orderIndex?: number;
}

// Project types
export interface Project {
    id: string;
    profileId: string;
    name: string;
    description?: string | null;
    url?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    type: 'project' | 'award';
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectInput {
    name: string;
    description?: string | null;
    url?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    type?: 'project' | 'award';
    orderIndex?: number;
}

// Certification types
export interface Certification {
    id: string;
    profileId: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string | null;
    credentialId?: string | null;
    credentialUrl?: string | null;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface CertificationInput {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string | null;
    credentialId?: string | null;
    credentialUrl?: string | null;
    orderIndex?: number;
}
