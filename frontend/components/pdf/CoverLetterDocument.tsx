'use client';

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';
import type { Profile } from '@/lib/types';

// Register fonts for professional look (using TTF format which react-pdf supports)
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Regular.ttf', fontWeight: 400 },
        { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-SemiBold.ttf', fontWeight: 600 },
        { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Bold.ttf', fontWeight: 700 },
    ],
});

// Professional cover letter styles
const styles = StyleSheet.create({
    page: {
        padding: 60,
        fontFamily: 'Inter',
        fontSize: 11,
        color: '#333',
        lineHeight: 1.6,
    },
    header: {
        marginBottom: 30,
    },
    senderInfo: {
        marginBottom: 4,
    },
    senderName: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 4,
    },
    senderDetail: {
        fontSize: 10,
        color: '#555',
    },
    date: {
        marginTop: 20,
        marginBottom: 20,
    },
    recipientInfo: {
        marginBottom: 20,
    },
    recipientLine: {
        fontSize: 11,
        marginBottom: 2,
    },
    greeting: {
        marginBottom: 16,
        fontWeight: 600,
    },
    body: {
        marginBottom: 16,
    },
    paragraph: {
        marginBottom: 12,
        textAlign: 'justify',
    },
    closing: {
        marginTop: 24,
    },
    closingText: {
        marginBottom: 30,
    },
    signature: {
        fontWeight: 600,
    },
});

interface CoverLetterDocumentProps {
    profile: Profile;
    company: string;
    jobTitle: string;
    coverLetterBody: string;
}

// Format current date
function formatCurrentDate(): string {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function CoverLetterDocument({
    profile,
    company,
    jobTitle,
    coverLetterBody,
}: CoverLetterDocumentProps) {
    // Split body into paragraphs
    const paragraphs = coverLetterBody
        .split('\n\n')
        .filter(Boolean)
        .map((p) => p.trim());

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                {/* Sender Information */}
                <View style={styles.header}>
                    <Text style={styles.senderName}>{profile.name}</Text>
                    <Text style={styles.senderDetail}>Toronto, Ontario</Text>
                    <Text style={styles.senderDetail}>{profile.phone}</Text>
                    <Text style={styles.senderDetail}>{profile.email}</Text>
                    {profile.linkedinUrl && (
                        <Text style={styles.senderDetail}>{profile.linkedinUrl}</Text>
                    )}
                </View>

                {/* Date */}
                <View style={styles.date}>
                    <Text>{formatCurrentDate()}</Text>
                </View>

                {/* Recipient Information */}
                <View style={styles.recipientInfo}>
                    <Text style={styles.recipientLine}>Hiring Manager</Text>
                    <Text style={styles.recipientLine}>{company}</Text>
                </View>

                {/* Greeting */}
                <View style={styles.greeting}>
                    <Text>Dear Hiring Manager,</Text>
                </View>

                {/* Body */}
                <View style={styles.body}>
                    {paragraphs.map((paragraph, index) => (
                        <Text key={index} style={styles.paragraph}>
                            {paragraph}
                        </Text>
                    ))}
                </View>

                {/* Closing */}
                <View style={styles.closing}>
                    <Text style={styles.closingText}>Sincerely,</Text>
                    <Text style={styles.signature}>{profile.name}</Text>
                </View>
            </Page>
        </Document>
    );
}
