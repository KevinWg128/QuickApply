'use client';

import { CertificationCard } from './CertificationCard';
import { CertificationForm } from './CertificationForm';
import type { Certification, CertificationInput } from '@/lib/types';
import { Award } from 'lucide-react';

interface CertificationsListProps {
    certifications: Certification[];
    onCreate: (data: CertificationInput) => Promise<void>;
    onUpdate: (id: string, data: CertificationInput) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function CertificationsList({ certifications, onCreate, onUpdate, onDelete }: CertificationsListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Certifications</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {certifications.length}
                    </span>
                </div>
                <CertificationForm onSubmit={onCreate} />
            </div>
            {certifications.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <Award className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        No certifications added yet
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {certifications.map((cert) => (
                        <CertificationCard
                            key={cert.id}
                            certification={cert}
                            onUpdate={(data) => onUpdate(cert.id, data)}
                            onDelete={() => onDelete(cert.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
