import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { desc, eq, inArray } from "drizzle-orm";
import { chatTable, frametable, projectsTable } from "@/db/schema";
import { db } from "@/db";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  // Get the project

  const projects = await 
  //@ts-ignore
db.select().from(projectsTable).where(eq(projectsTable.createdBy, 
user?.primaryEmailAddress?.emailAddress)).orderBy(desc(projectsTable.createdOn));

  let results: {
    projectId: string;
    frameId: string;
    chats: { id: number; chatMessage: any; createdBy: string; createdOn: Date }[];
  }[] = [];

  for (const project of projects) {
    const frames = await db
      .select({ frameId: frametable.frameId })
      .from(frametable)
      //@ts-ignore
      .where(eq(frametable.projectId, project.projectId));

    // Fetch chats for all frames in this project in one query
    const frameIds = frames.map((f: any) => f.frameId);
    let chats: any[] = [];
    if (frameIds.length > 0) {
      chats = await db
        .select()
        .from(chatTable)
        .where(inArray(chatTable.frameId, frameIds));
    }

    // Combine: attach chats to each frame
    for (const frame of frames) {
      results.push({
        projectId: project.projectId ?? '',
        frameId: frame.frameId ?? '',
        chats: chats.filter((c) => c.frameId === frame.frameId),
      });
    }
  }

  return NextResponse.json(results);
}