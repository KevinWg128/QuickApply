import type {
    Profile,
    ProfileInput,
    WorkExperience,
    WorkExperienceInput,
    Education,
    EducationInput,
    Skill,
    SkillInput,
    Project,
    ProjectInput,
    Certification,
    CertificationInput,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const RESUME_API_URL = process.env.NEXT_PUBLIC_RESUME_API_URL || 'http://localhost:3004';

// Generic fetch wrapper with error handling
async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

// Fetch wrapper for file uploads (FormData)
async function fetchFileApi<T>(
    endpoint: string,
    formData: FormData
): Promise<T> {
    const url = `${RESUME_API_URL}${endpoint}`;
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // Content-Type header is explicitly NOT set to let browser set it with boundary
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
}

// ============ Profile API ============
export const profileApi = {
    get: () => fetchApi<Profile | null>('/profile'),

    create: (data: ProfileInput) =>
        fetchApi<Profile>('/profile', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (data: Partial<ProfileInput>) =>
        fetchApi<Profile>('/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// ============ Experience API ============
export const experienceApi = {
    getAll: () => fetchApi<WorkExperience[]>('/experiences'),

    getById: (id: string) => fetchApi<WorkExperience>(`/experiences/${id}`),

    create: (data: WorkExperienceInput) =>
        fetchApi<WorkExperience>('/experiences', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<WorkExperienceInput>) =>
        fetchApi<WorkExperience>(`/experiences/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/experiences/${id}`, { method: 'DELETE' }),
};

// ============ Education API ============
export const educationApi = {
    getAll: () => fetchApi<Education[]>('/education'),

    getById: (id: string) => fetchApi<Education>(`/education/${id}`),

    create: (data: EducationInput) =>
        fetchApi<Education>('/education', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<EducationInput>) =>
        fetchApi<Education>(`/education/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/education/${id}`, { method: 'DELETE' }),
};

// ============ Skills API ============
export const skillsApi = {
    getAll: () => fetchApi<Skill[]>('/skills'),

    getById: (id: string) => fetchApi<Skill>(`/skills/${id}`),

    create: (data: SkillInput) =>
        fetchApi<Skill>('/skills', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    bulkCreate: (skills: SkillInput[]) =>
        fetchApi<{ count: number }>('/skills/bulk', {
            method: 'POST',
            body: JSON.stringify({ skills }),
        }),

    update: (id: string, data: Partial<SkillInput>) =>
        fetchApi<Skill>(`/skills/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/skills/${id}`, { method: 'DELETE' }),
};

// ============ Projects API ============
export const projectsApi = {
    getAll: (type?: 'project' | 'award') => {
        const query = type ? `?type=${type}` : '';
        return fetchApi<Project[]>(`/projects${query}`);
    },

    getById: (id: string) => fetchApi<Project>(`/projects/${id}`),

    create: (data: ProjectInput) =>
        fetchApi<Project>('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<ProjectInput>) =>
        fetchApi<Project>(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/projects/${id}`, { method: 'DELETE' }),
};

// ============ Certifications API ============
export const certificationsApi = {
    getAll: () => fetchApi<Certification[]>('/certifications'),

    getById: (id: string) => fetchApi<Certification>(`/certifications/${id}`),

    create: (data: CertificationInput) =>
        fetchApi<Certification>('/certifications', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<CertificationInput>) =>
        fetchApi<Certification>(`/certifications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/certifications/${id}`, { method: 'DELETE' }),
};

// ============ Resume API ============
export const resumeApi = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('resume', file);
        return fetchFileApi<{ message: string; data: any }>('/api/resume/upload', formData);
    },
};
