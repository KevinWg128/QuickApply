'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { JobApplicationList } from '@/components/jobs/JobApplicationList';
import { jobApplicationApi, profileApi } from '@/lib/api';
import type {
  JobApplication,
  JobApplicationInput,
  ApplicationStatus,
  PaginatedResponse,
  Profile,
} from '@/lib/types';
import {
  Zap,
  User,
  Settings,
  Loader2,
} from 'lucide-react';

export default function JobApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [data, setData] = useState<PaginatedResponse<JobApplication>>({
    data: [],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, applicationsData] = await Promise.all([
        profileApi.get(),
        jobApplicationApi.getAll(page, limit),
      ]);
      setProfile(profileData);
      setData(applicationsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (input: JobApplicationInput) => {
    const newApplication = await jobApplicationApi.create(input);
    setData((prev) => ({
      ...prev,
      data: [newApplication, ...prev.data].slice(0, limit),
      pagination: {
        ...prev.pagination,
        total: prev.pagination.total + 1,
        totalPages: Math.ceil((prev.pagination.total + 1) / limit),
      },
    }));
  };

  const handleUpdate = async (
    id: string,
    input: Partial<JobApplicationInput> & { status?: ApplicationStatus }
  ) => {
    const updated = await jobApplicationApi.update(id, input);
    setData((prev) => ({
      ...prev,
      data: prev.data.map((app) => (app.id === id ? updated : app)),
    }));
  };

  const handleDelete = async (id: string) => {
    await jobApplicationApi.delete(id);
    setData((prev) => ({
      ...prev,
      data: prev.data.filter((app) => app.id !== id),
      pagination: {
        ...prev.pagination,
        total: prev.pagination.total - 1,
        totalPages: Math.ceil((prev.pagination.total - 1) / limit),
      },
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading job applications...</p>
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
              <p className="text-xs text-muted-foreground">Job Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild title="My Profile">
              <Link href="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild title="Settings">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {profile && (
          <div className="mb-6 rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">{profile.name}</span>!
              Track your job applications below.
            </p>
          </div>
        )}

        <JobApplicationList
          data={data}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            Quick Apply © {new Date().getFullYear()} — Your job search, simplified.
          </p>
        </div>
      </footer>
    </div>
  );
}
