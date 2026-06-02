import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const [cohorts, enrollments, progressEvents, quizAttempts, smeAlerts] =
    await Promise.all([
      prisma.cohort.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } }),
      prisma.enrollment.findMany({ where: { projectId }, orderBy: { enrolledAt: "asc" } }),
      prisma.progressEvent.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" }
      }),
      prisma.quizAttempt.findMany({
        where: { projectId },
        orderBy: { submittedAt: "asc" }
      }),
      prisma.sMEAlert.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } })
    ]);

  return NextResponse.json({
    cohorts,
    enrollments,
    progressEvents: progressEvents.map((e: { eventData: string; [key: string]: unknown }) => ({
      ...e,
      eventData: JSON.parse(e.eventData)
    })),
    quizAttempts,
    smeAlerts
  });
}
