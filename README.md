# QuickApply

A job application tracking platform with AI-powered resume tailoring. Upload your resume, track your job applications, and generate tailored resumes and cover letters using Google Gemini AI.

## Features

- **Profile Management** - Store your professional information, experience, education, and skills
- **Resume Upload** - Upload your existing resume (PDF) and automatically extract information using AI
- **Job Application Tracking** - Keep track of all your job applications with status updates
- **AI-Powered Resume Tailoring** - Generate tailored resumes and cover letters for specific job postings using Google Gemini
- **PDF Generation** - Download professionally formatted PDFs of your tailored resumes

## Architecture

The application consists of the following services:

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3002 | Next.js web application |
| Profile Service | 3001 | Manages user profiles and professional information |
| Resume Service | 3004 | Handles resume extraction and AI-powered tailoring |
| Job Service | 3005 | Tracks job applications |
| PostgreSQL | 54323 | Database for persistent storage |

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Gemini API Key** - You need a Google Gemini API key for AI features (resume extraction and tailoring)
  - Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KevinWg128/QuickApply.git
cd QuickApply
```

### 2. Start the services

```bash
docker-compose up -d
```

This will start all services including the database. Wait for all containers to be healthy.

### 3. Access the application

Open your browser and navigate to: **http://localhost:3002**

### 4. Initial Setup (Required)

Before using the AI features, you **must complete these steps**:

1. **Create Your Profile**
   - Navigate to the Profile page (click the user icon in the navigation bar)
   - Fill in your personal information, experience, education, and skills
   - This information will be used to generate tailored resumes

2. **Set Your Gemini API Key**
   - On the Profile page, click the settings icon (gear icon)
   - Enter your Gemini API key and save
   - This key is required for resume upload extraction and AI-powered tailoring

> ⚠️ **Important**: Without a profile and Gemini API key, you won't be able to use the resume tailoring feature.

## Usage

### Adding Job Applications

1. On the home page, click the **"Add Job Application"** button
2. Fill in the job details (title, company, description, URL, etc.)
3. Track the status of your applications

### Tailoring Your Resume

1. Find a job application you want to apply to
2. Click the **"Tailor Resume"** button on the job card
3. The AI will generate a tailored resume and cover letter based on:
   - Your profile information
   - The job description
4. Preview and download the PDF

### Uploading an Existing Resume

1. Click the upload icon in the navigation bar
2. Select your resume PDF file
3. The AI will extract information and update your profile

## Development

### Running Locally Without Docker

If you prefer to run services individually:

1. **Start PostgreSQL** (or use Docker for just the database):
   ```bash
   docker-compose up -d postgres
   ```

2. **Install dependencies** for each service:
   ```bash
   cd frontend && pnpm install
   cd ../profile-service && pnpm install
   cd ../resume-service && pnpm install
   cd ../job-service && pnpm install
   ```

3. **Set up environment variables** for each service (see `.env.example` files)

4. **Run database migrations**:
   ```bash
   cd profile-service && pnpm prisma migrate dev
   cd ../job-service && pnpm prisma migrate dev
   ```

5. **Start each service**:
   ```bash
   # In separate terminals
   cd frontend && pnpm dev
   cd profile-service && pnpm dev
   cd resume-service && pnpm dev
   cd job-service && pnpm dev
   ```

### Environment Variables

#### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RESUME_API_URL=http://localhost:3004
NEXT_PUBLIC_JOB_API_URL=http://localhost:3005
```

#### Backend Services
```
DATABASE_URL=postgresql://quickapply:quickapply_dev@localhost:54323/quickapply
PORT=<service-port>
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.