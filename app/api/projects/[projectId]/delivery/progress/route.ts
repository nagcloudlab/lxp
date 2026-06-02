import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const event = await prisma.progressEvent.create({
    data: {
      ...body,
      projectId,
      eventData: JSON.stringify(body.eventData ?? {})
    }
  });
  return NextResponse.json(
    { ...event, eventData: JSON.parse(event.eventData) },
    { status: 201 }
  );
}
