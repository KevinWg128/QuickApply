'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ExperienceList } from '@/components/experience/ExperienceList';
import { EducationList } from '@/components/education/EducationList';
import { SkillsList } from '@/components/skills/SkillsList';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { CertificationsList } from '@/components/certifications/CertificationsList';
import {
  profileApi,
  experienceApi,
  educationApi,
  skillsApi,
  projectsApi,
  certificationsApi,
} from '@/lib/api';
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
} from '@/lib/types';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Loader2,
  Zap,
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // Fetch all data on mount
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, experiencesData, educationsData, skillsData, projectsData, certificationsData] =
        await Promise.all([
          profileApi.get(),
          experienceApi.getAll(),
          educationApi.getAll(),
          skillsApi.getAll(),
          projectsApi.getAll(),
          certificationsApi.getAll(),
        ]);

      setProfile(profileData);
      setExperiences(experiencesData);
      setEducations(educationsData);
      setSkills(skillsData);
      setProjects(projectsData);
      setCertifications(certificationsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Profile handlers
  const handleProfileUpdate = async (data: ProfileInput) => {
    const result = profile
      ? await profileApi.update(data)
      : await profileApi.create(data);
    setProfile(result);
  };

  // Experience handlers
  const handleExperienceCreate = async (data: WorkExperienceInput) => {
    const result = await experienceApi.create(data);
    setExperiences((prev) => [...prev, result]);
  };

  const handleExperienceUpdate = async (id: string, data: WorkExperienceInput) => {
    const result = await experienceApi.update(id, data);
    setExperiences((prev) => prev.map((e) => (e.id === id ? result : e)));
  };

  const handleExperienceDelete = async (id: string) => {
    await experienceApi.delete(id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  // Education handlers
  const handleEducationCreate = async (data: EducationInput) => {
    const result = await educationApi.create(data);
    setEducations((prev) => [...prev, result]);
  };

  const handleEducationUpdate = async (id: string, data: EducationInput) => {
    const result = await educationApi.update(id, data);
    setEducations((prev) => prev.map((e) => (e.id === id ? result : e)));
  };

  const handleEducationDelete = async (id: string) => {
    await educationApi.delete(id);
    setEducations((prev) => prev.filter((e) => e.id !== id));
  };

  // Skills handlers
  const handleSkillCreate = async (data: SkillInput) => {
    const result = await skillsApi.create(data);
    setSkills((prev) => [...prev, result]);
  };

  const handleSkillDelete = async (id: string) => {
    await skillsApi.delete(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  // Projects handlers
  const handleProjectCreate = async (data: ProjectInput) => {
    const result = await projectsApi.create(data);
    setProjects((prev) => [...prev, result]);
  };

  const handleProjectUpdate = async (id: string, data: ProjectInput) => {
    const result = await projectsApi.update(id, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? result : p)));
  };

  const handleProjectDelete = async (id: string) => {
    await projectsApi.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Certifications handlers
  const handleCertificationCreate = async (data: CertificationInput) => {
    const result = await certificationsApi.create(data);
    setCertifications((prev) => [...prev, result]);
  };

  const handleCertificationUpdate = async (id: string, data: CertificationInput) => {
    const result = await certificationsApi.update(id, data);
    setCertifications((prev) => prev.map((c) => (c.id === id ? result : c)));
  };

  const handleCertificationDelete = async (id: string) => {
    await certificationsApi.delete(id);
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Quick Apply</h1>
              <p className="text-xs text-muted-foreground">Resume Manager</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Profile Section */}
        <section className="mb-8">
          <ProfileCard profile={profile} onUpdate={handleProfileUpdate} />
        </section>

        <Separator className="my-8" />

        {/* Tabbed Sections */}
        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="mb-6 flex w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
            <TabsTrigger
              value="experience"
              className="gap-2 data-[state=active]:bg-muted"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Experience</span>
              <span className="rounded-full bg-muted px-1.5 text-xs">
                {experiences.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="gap-2 data-[state=active]:bg-muted"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Education</span>
              <span className="rounded-full bg-muted px-1.5 text-xs">
                {educations.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="gap-2 data-[state=active]:bg-muted"
            >
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
              <span className="rounded-full bg-muted px-1.5 text-xs">
                {skills.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="gap-2 data-[state=active]:bg-muted"
            >
              <FolderGit2 className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
              <span className="rounded-full bg-muted px-1.5 text-xs">
                {projects.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="gap-2 data-[state=active]:bg-muted"
            >
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Certs</span>
              <span className="rounded-full bg-muted px-1.5 text-xs">
                {certifications.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-400px)] min-h-[400px]">
            <TabsContent value="experience" className="mt-0">
              <ExperienceList
                experiences={experiences}
                onCreate={handleExperienceCreate}
                onUpdate={handleExperienceUpdate}
                onDelete={handleExperienceDelete}
              />
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <EducationList
                educations={educations}
                onCreate={handleEducationCreate}
                onUpdate={handleEducationUpdate}
                onDelete={handleEducationDelete}
              />
            </TabsContent>

            <TabsContent value="skills" className="mt-0">
              <SkillsList
                skills={skills}
                onCreate={handleSkillCreate}
                onDelete={handleSkillDelete}
              />
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <ProjectsList
                projects={projects}
                onCreate={handleProjectCreate}
                onUpdate={handleProjectUpdate}
                onDelete={handleProjectDelete}
              />
            </TabsContent>

            <TabsContent value="certifications" className="mt-0">
              <CertificationsList
                certifications={certifications}
                onCreate={handleCertificationCreate}
                onUpdate={handleCertificationUpdate}
                onDelete={handleCertificationDelete}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            Quick Apply © {new Date().getFullYear()} — Your resume, simplified.
          </p>
        </div>
      </footer>
    </div>
  );
}
