-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'learner'
);

-- CreateTable
CREATE TABLE "TrainingProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "businessGoal" TEXT NOT NULL,
    "targetDepartment" TEXT NOT NULL,
    "expectedLearnerCount" INTEGER NOT NULL,
    "targetCompletionDate" TEXT NOT NULL,
    "learnerRoles" TEXT NOT NULL,
    "assignedSme" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SourceDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "extractionStatus" TEXT NOT NULL DEFAULT 'ready',
    "isActiveForGeneration" BOOLEAN NOT NULL DEFAULT true,
    "extractedText" TEXT NOT NULL DEFAULT '',
    "extractionError" TEXT,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "SourceDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgramPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sourceDocumentIds" TEXT NOT NULL DEFAULT '[]',
    "generationMetadata" TEXT NOT NULL DEFAULT '{}',
    "requirementSummary" TEXT NOT NULL DEFAULT '',
    "businessContext" TEXT NOT NULL DEFAULT '',
    "targetAudience" TEXT NOT NULL DEFAULT '',
    "assumptions" TEXT NOT NULL DEFAULT '[]',
    "conflicts" TEXT NOT NULL DEFAULT '[]',
    "learnerRoles" TEXT NOT NULL DEFAULT '[]',
    "modules" TEXT NOT NULL DEFAULT '[]',
    "assessmentBlueprint" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "ProgramPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentArtifact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "artifactType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentBody" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sourceDocumentIds" TEXT NOT NULL DEFAULT '[]',
    "generationMetadata" TEXT NOT NULL DEFAULT '{}',
    "approvedAt" TEXT,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "ContentArtifact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentArtifact_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ProgramPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cohort" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "instructorName" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "Cohort_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cohort_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ProgramPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "learnerName" TEXT NOT NULL,
    "learnerEmail" TEXT NOT NULL,
    "learnerRoleId" TEXT NOT NULL,
    "learnerRoleName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'enrolled',
    "enrolledAt" TEXT NOT NULL,
    CONSTRAINT "Enrollment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "moduleId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventData" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "ProgressEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "maxScore" REAL NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "submittedAt" TEXT NOT NULL,
    CONSTRAINT "QuizAttempt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SMEAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "moduleId" TEXT,
    "triggerReason" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "resolverNotes" TEXT,
    "createdAt" TEXT NOT NULL,
    "resolvedAt" TEXT,
    CONSTRAINT "SMEAlert_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetLabel" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "resolvedBy" TEXT,
    "resolvedAt" TEXT,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "ReviewComment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "targetLabel" TEXT,
    "details" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "AuditEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TrainingProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
