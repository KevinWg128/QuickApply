'use client';

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link,
    Font,
} from '@react-pdf/renderer';
import type {
    Profile,
    WorkExperience,
    Education,
    Project,
    Certification,
} from '@/lib/types';

// Register fonts for professional look (using TTF format which react-pdf supports)
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Regular.ttf', fontWeight: 400 },
        { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-SemiBold.ttf', fontWeight: 600 },
        { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Bold.ttf', fontWeight: 700 },
    ],
});

// Styles matching the provided resume template
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Inter',
        fontSize: 10,
        color: '#333',
    },
    // Header section
    header: {
        marginBottom: 8,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    name: {
        fontSize: 20,
        fontWeight: 700,
        marginRight: 12,
    },
    contactInfo: {
        fontSize: 10,
        color: '#333',
    },
    contactRow: {
        flexDirection: 'row',
        gap: 6,
        fontSize: 10,
    },
    link: {
        color: '#2563eb',
        textDecoration: 'underline',
    },
    // Title bar with blue line
    titleBar: {
        marginTop: 8,
        marginBottom: 8,
    },
    blueLine: {
        height: 2,
        backgroundColor: '#2563eb',
        marginBottom: 6,
    },
    jobTitleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    jobTitle: {
        fontSize: 12,
        fontWeight: 700,
        textAlign: 'center',
    },
    keySkillsDivider: {
        color: '#2563eb',
        fontWeight: 700,
    },
    keySkill: {
        fontSize: 11,
        color: '#333',
    },
    // Section styles
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 6,
        color: '#333',
    },
    // Summary bullets
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 6,
        paddingLeft: 8,
    },
    bullet: {
        width: 8,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.4,
    },
    // Skills grid (3 columns)
    skillsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
    },
    skillColumn: {
        width: '30%',
        textAlign: 'center',
    },
    skillItem: {
        fontSize: 10,
        marginBottom: 2,
    },
    // Experience section
    experienceItem: {
        marginBottom: 10,
    },
    experienceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    experienceTitle: {
        fontSize: 11,
        fontWeight: 700,
    },
    experienceDate: {
        fontSize: 10,
        color: '#333',
    },
    experienceCompany: {
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
    },
    // Education section
    educationItem: {
        marginBottom: 6,
    },
    educationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    educationDegree: {
        fontSize: 11,
        fontWeight: 600,
    },
    educationInstitution: {
        fontSize: 10,
        color: '#666',
    },
    // Projects/Awards
    projectItem: {
        marginBottom: 8,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    projectTitle: {
        fontSize: 11,
        fontWeight: 600,
    },
    projectDesc: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    },
    // Certifications
    certItem: {
        marginBottom: 4,
    },
    certHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    certName: {
        fontSize: 11,
        fontWeight: 600,
    },
    certIssuer: {
        fontSize: 10,
        color: '#666',
    },
});

interface ResumeDocumentProps {
    profile: Profile;
    jobTitle: string;
    summaryBullets: string[];
    keySkills: string[];
    relevantSkills: string[];
}

// Format date for display
function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

// Helper to format URLs for display (strip protocol)
function formatUrl(url: string | null | undefined): string {
    if (!url) return '';
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

export function ResumeDocument({
    profile,
    jobTitle,
    summaryBullets,
    keySkills,
    relevantSkills,
}: ResumeDocumentProps) {
    const workExperiences = profile.workExperiences || [];
    const educations = profile.educations || [];
    const projects = profile.projects || [];
    const certifications = profile.certifications || [];

    // Split skills into 3 columns
    const skillsPerColumn = Math.ceil(relevantSkills.length / 3);
    const skillColumns = [
        relevantSkills.slice(0, skillsPerColumn),
        relevantSkills.slice(skillsPerColumn, skillsPerColumn * 2),
        relevantSkills.slice(skillsPerColumn * 2),
    ];

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={styles.name}>{profile.name}</Text>
                        <Text style={styles.contactInfo}>
                            Toronto, Ontario | {profile.phone || ''}
                        </Text>
                    </View>
                    <View style={styles.contactRow}>
                        <Text>{profile.email}</Text>
                        {profile.linkedinUrl && (
                            <>
                                <Text> | </Text>
                                <Link src={profile.linkedinUrl} style={styles.link}>
                                    LinkedIn
                                </Link>
                            </>
                        )}
                        {profile.personalSiteUrl && (
                            <>
                                <Text> | </Text>
                                <Link src={profile.personalSiteUrl} style={styles.link}>
                                    Portfolio
                                </Link>
                            </>
                        )}
                    </View>
                </View>

                {/* Title Bar with Blue Line */}
                <View style={styles.titleBar}>
                    <View style={styles.blueLine} />
                    <View style={styles.jobTitleRow}>
                        <Text style={styles.jobTitle}>{jobTitle}</Text>
                    </View>
                    <View style={[styles.jobTitleRow, { marginTop: 4 }]}>
                        {keySkills.map((skill, index) => (
                            <View key={skill} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.keySkill}>{skill}</Text>
                                {index < keySkills.length - 1 && (
                                    <Text style={[styles.keySkillsDivider, { marginLeft: 20 }]}>|</Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Summary Bullets */}
                <View style={styles.section}>
                    {summaryBullets.map((bullet, index) => (
                        <View key={index} style={styles.bulletItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>{bullet}</Text>
                        </View>
                    ))}
                </View>

                {/* Technical Skills */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technical Skills</Text>
                    <View style={styles.skillsGrid}>
                        {skillColumns.map((column, colIndex) => (
                            <View key={colIndex} style={styles.skillColumn}>
                                {column.map((skill) => (
                                    <Text key={skill} style={styles.skillItem}>
                                        {skill}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Work Experience */}
                {workExperiences.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Related Work Experience</Text>
                        {workExperiences.map((exp: WorkExperience) => (
                            <View key={exp.id} style={styles.experienceItem}>
                                <View style={styles.experienceHeader}>
                                    <Text style={styles.experienceTitle}>
                                        {exp.title} {exp.location && `(${exp.location})`}
                                    </Text>
                                    <Text style={styles.experienceDate}>
                                        {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                                    </Text>
                                </View>
                                <Text style={styles.experienceCompany}>{exp.company}</Text>
                                {exp.description && (
                                    <View>
                                        {exp.description.split('\n').filter(Boolean).map((line, idx) => (
                                            <View key={idx} style={styles.bulletItem}>
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.bulletText}>{line.replace(/^[•\-]\s*/, '')}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Projects and Awards */}
                {projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Project and Award</Text>
                        {projects.map((project: Project) => (
                            <View key={project.id} style={styles.projectItem}>
                                <View style={styles.projectHeader}>
                                    <Text style={styles.projectTitle}>{project.name}</Text>
                                    <Text style={styles.experienceDate}>
                                        {formatDate(project.endDate)}
                                    </Text>
                                </View>
                                {project.description && (
                                    <Text style={styles.projectDesc}>{project.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {educations.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {educations.map((edu: Education) => (
                            <View key={edu.id} style={styles.educationItem}>
                                <View style={styles.educationHeader}>
                                    <View>
                                        <Text style={styles.educationDegree}>{edu.degree}</Text>
                                        <Text style={styles.educationInstitution}>{edu.institution}</Text>
                                    </View>
                                    <Text style={styles.experienceDate}>
                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        {certifications.map((cert: Certification) => (
                            <View key={cert.id} style={styles.certItem}>
                                <View style={styles.certHeader}>
                                    <View>
                                        <Text style={styles.certName}>{cert.name}</Text>
                                        <Text style={styles.certIssuer}>{cert.issuer}</Text>
                                    </View>
                                    <Text style={styles.experienceDate}>
                                        {formatDate(cert.issueDate)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
}
